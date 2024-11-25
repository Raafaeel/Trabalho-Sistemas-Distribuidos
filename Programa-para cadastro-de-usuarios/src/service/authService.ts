import axios from 'axios';

const BASE_URL = "https://myfastapiapp-v3-668469425698.southamerica-east1.run.app";

export const login = async (username: string, senha: string): Promise<number | null> => {
  try {
    const url = `${BASE_URL}/usuarios/login?login=${encodeURIComponent(username)}&senha=${encodeURIComponent(senha)}`;

    const response = await axios.post(url);

    if (response.data) {
      localStorage.setItem('codigoUsuario', response.data.codigo.toString());
      return response.data.codigo;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Dados de login inválidos.');
  }
};

export const loginWithGoogle = async (googleToken: string): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/google`, { token: googleToken });

    if (response.status === 200 && response.data.codigo) {
      localStorage.setItem("codigoUsuario", response.data.codigo.toString());
      return response.data.codigo;
    } else {
      throw new Error("Erro ao autenticar com Google.");
    }
  } catch (error) {
    throw new Error("Não foi possível fazer login com Google.");
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('codigoUsuario');
};

export const getCodigoUsuario = (): number | null => {
  const codigo = localStorage.getItem('codigoUsuario');
  return codigo ? parseInt(codigo, 10) : null;
};

export const logout = () => {
  localStorage.removeItem('codigoUsuario');
};

