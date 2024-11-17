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
        password: '',})
        
        const[error, setError] = useState('')
        const router = useRouter()

        const handleFormEdit = (event, name) => {
            setFormData({
                ...formData,
                [name]: event.target.value
            })
        }
    
        return (
        <div className={styles.background}>
        <LoginCard title="Entrar">
            <form className={styles.form}>
                <Input type="email" placeholder="Seu email"  required value={formData.email} onChange={(e) => {handleFormEdit(e,'email')}}/>
                <Input type="password" placeholder="Sua senha"  required value={formData.password} onChange={(e) => {handleFormEdit(e,'password')}}/>
                <Button>Entrar</Button>
                <Link href='/cadastro'>Ainda não tem uma conta?</Link>
            </form>
        </LoginCard>
    </div>
    );
}
