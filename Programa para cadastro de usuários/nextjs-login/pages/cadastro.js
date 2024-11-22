import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import LoginCard from "../src/components/loginCard/loginCard";
import Button from '../src/components/button/button';
import Input from '../src/components/input/input';
import { useForm } from "react-hook-form";

export default function CadastroPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        nascimento: '',
        longitude: '',
        latitude: '',
        sexo: '',
    });

    const [error, setError] = useState('');
    const router = useRouter();

    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value,
        });
    };

    const handleForm = async (data) => {
        try {
            const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nome: formData.name,
                    Nascimento: formData.nascimento,
                    Sexo: formData.sexo,
                    Latitude: parseFloat(formData.latitude),
                    Longitude: parseFloat(formData.longitude),
                    login: formData.email,
                    senha: formData.password,
                }),
            });

            const json = await response.json();
            if (!response.ok) throw new Error(json.message || 'Erro inesperado');

            alert('Cadastro realizado com sucesso!');
            setFormData({
                name: '',
                email: '',
                password: '',
                nascimento: '',
                longitude: '',
                latitude: '',
                sexo: '',
            });
        } catch (err) {
            setError(err.message || 'Erro ao processar o cadastro');
        }
    };

    return (
        <div className={styles.background}>
            <LoginCard title="Faça sua conta">
                <form onSubmit={handleForm} className={styles.form}>
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
                        type="password"
                        placeholder="Sua senha"
                        required
                        value={formData.password}
                        onChange={(e) => handleFormEdit(e, 'password')}
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
                    <Button>Cadastrar</Button>
                    {error && <p className={styles.error}>{error}</p>}
                    <Link href='/login'>Já possui uma conta?</Link>
                </form>
            </LoginCard>
        </div>
    );
}
