import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Login.module.css';
import LoginCard from "../src/components/loginCard/loginCard";
import Button from '../src/components/button/button';
import Input from '../src/components/input/input';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleFormEdit = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: formData.email,
                    senha: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login ou senha inválidos');
            }

            const data = await response.json();
            setCookie('user', JSON.stringify(data)); // Armazena o usuário autenticado
            router.push('/dashboard'); // Redireciona após login bem-sucedido
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.background}>
            <LoginCard title="Entrar">
                <form className={styles.form} onSubmit={handleSubmit}>
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
                    {error && <p className={styles.error}>{error}</p>}
                    <Button type="submit">Entrar</Button>
                    <Link href="/cadastro">Ainda não tem uma conta?</Link>
                </form>
            </LoginCard>
        </div>
    );
}
