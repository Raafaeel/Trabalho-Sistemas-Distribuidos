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
        setError(''); // Limpa mensagens de erro ao enviar o formulário
    
        try {
            // Faz a requisição de login para a API
            const response = await fetch("https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios/loginJson", {
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
    
            // Obtém os dados retornados pela API
            const data = await response.json();
            console.log('Dados do usuário após login:', data); // Apenas para depuração
    
            // Salva os dados do usuário no cookie (ou localStorage)
            setCookie('user', JSON.stringify(data)); // Salva o usuário autenticado
    
            // Redireciona para a página inicial
            router.push('/');
        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message || 'Erro ao processar login');
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
