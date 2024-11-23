import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import Button from '../src/components/button/button';
import Input from '../src/components/input/input';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nascimento: '',
        longitude: '',
        latitude: '',
        sexo: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Recupera os dados do usuário
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getCookie('authorization');
                if (!token) throw new Error('Token inválido');

                const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Erro ao buscar dados');

                const data = await response.json();
                setFormData({
                    name: data.Nome || '',
                    email: data.login || '',
                    nascimento: data.Nascimento || '',
                    longitude: data.Longitude?.toString() || '',
                    latitude: data.Latitude?.toString() || '',
                    sexo: data.Sexo || '',
                });
            } catch (err) {
                setError(err.message || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Atualiza os campos do formulário
    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value,
        });
    };

    // Envia os dados atualizados
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const token = getCookie('authorization');
            if (!token) throw new Error('Token inválido');

            const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Nome: formData.name,
                    Nascimento: formData.nascimento,
                    Sexo: formData.sexo,
                    Latitude: parseFloat(formData.latitude),
                    Longitude: parseFloat(formData.longitude),
                }),
            });
            if (!response.ok) throw new Error('Erro ao atualizar cadastro');

            alert('Cadastro atualizado com sucesso!');
        } catch (err) {
            setError(err.message || 'Erro ao processar atualização');
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className={styles.background}>
            <h1>Editar Cadastro</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="text"
                    placeholder="Seu nome"
                    required
                    value={formData.name}
                    onChange={(e) => handleFormEdit(e, 'name')}
                />
                <Input
                    type="email"
                    placeholder="Seu email"
                    required
                    value={formData.email}
                    disabled // Email não pode ser editado
                />
                <Input
                    type="date"
                    placeholder="Data de nascimento"
                    required
                    value={formData.nascimento}
                    onChange={(e) => handleFormEdit(e, 'nascimento')}
                />
                <Input
                    type="number"
                    placeholder="Longitude"
                    required
                    value={formData.longitude}
                    onChange={(e) => handleFormEdit(e, 'longitude')}
                />
                <Input
                    type="number"
                    placeholder="Latitude"
                    required
                    value={formData.latitude}
                    onChange={(e) => handleFormEdit(e, 'latitude')}
                />
                <select
                    value={formData.sexo}
                    onChange={(e) => handleFormEdit(e, 'sexo')}
                    className={styles.genderSelect}
                    required
                >
                    <option value="">Selecione o sexo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
                <Button>Atualizar</Button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}
