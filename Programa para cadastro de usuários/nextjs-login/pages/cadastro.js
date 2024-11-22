import { useState } from 'react';
import Link from 'next/link';
import { setCookie } from 'cookies-next';
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
        longitude: '',
        latitude: '',
    });

    const [error, setError] = useState('');
    const router = useRouter();
    const { register, handleSubmit } = useForm();

    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value,
        });
    };

    const handleForm = async (data) => {
        try {
            const response = await fetch('http://localhost:8000/dados', { // URL da sua API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigo: formData.codigo,  // Adapte os campos conforme a API
                    Tipo: formData.tipo,
                    Valor1: parseFloat(formData.valor1),
                    Valor2: parseFloat(formData.valor2),
                    EmCasa: formData.emCasa === 'true',
                }),
            });
    
            const json = await response.json();
            if (!response.ok) throw new Error(json.message || 'Erro inesperado');
    
            alert('Cadastro realizado com sucesso!');
            setFormData({ name: '', email: '', password: '', longitude: '', latitude: '' });
        } catch (err) {
            setError(err.message || 'Erro ao processar o cadastro');
        }
    };
    
    return (
        <div className={styles.background}>
            <LoginCard title="Faça sua conta">
                <form onSubmit={handleSubmit(handleForm)} className={styles.form}>
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
                        {...register("sexo", { required: true })}
                        className={styles.genderSelect}>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            </select>

                    <Button>Cadastrar</Button>
                    {error && <p className={styles.error}>{error}</p>}
                    <Link href='/login'>Ja passui uma conta?</Link>
                </form>
            </LoginCard>
        </div>
    );
}
