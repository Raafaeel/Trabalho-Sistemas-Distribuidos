import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import LoginCard from "../src/components/loginCard/loginCard";
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

    // Verifica se o usuário está autenticado e carrega seus dados
    useEffect(() => {
        const userCookie = getCookie('user');
        if (!userCookie) {
            console.log('Usuário não autenticado, redirecionando para login...');
            router.push('/login');
            return;
        }

        // Carrega os dados do usuário do cookie
        const userData = JSON.parse(userCookie);
        console.log('Dados do usuário carregados:', userData);

        setFormData({
            name: userData.Nome || '',
            email: userData.login || '',
            nascimento: userData.Nascimento || '',
            longitude: userData.Longitude?.toString() || '',
            latitude: userData.Latitude?.toString() || '',
            sexo: userData.Sexo || '',
            id:userData.codigo  || '',
        });
        setLoading(false);
    }, [router]);

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
            const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios/"+formData.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nome: formData.name,
                    login: formData.email,
                    Nascimento: formData.nascimento,
                    Sexo: formData.sexo,
                    Latitude: parseFloat(formData.latitude),
                    Longitude: parseFloat(formData.longitude),
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar dados no servidor');
            }

            const data = await response.json();
            console.log('Dados atualizados com sucesso:', data);

            // Atualize o cookie com os novos dados, se necessário
            //setCookie('user', JSON.stringify(data));

            alert('Cadastro atualizado com sucesso!');
        } catch (err) {
            console.error('Erro ao atualizar cadastro:', err);
            setError(err.message || 'Erro ao processar atualização');
        }
    };

    if (loading) return <p>Carregando...</p>;


return (
    <div className={styles.background}>
       <LoginCard title="Bem-vindo">
        <form className={styles.form} onSubmit={handleSubmit}>
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
                onChange={(e) => handleFormEdit(e, 'email')}

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
            <Input
                type="number"
                placeholder="Seu ID"
                value={formData.id}
                disabled // ID não pode ser editado
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
            </LoginCard>
            </div>
);
}
