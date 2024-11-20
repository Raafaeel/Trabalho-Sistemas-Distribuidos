import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://myfastapiapp-v3-668469425698.southamerica-east1.run.app";

export const login = async (username, senha) => {
  try {
    const url = `${BASE_URL}/usuarios/login?login=${encodeURIComponent(username)}&senha=${encodeURIComponent(senha)}`;
    const response = await axios.post(url);

    if (response.data) {
      await AsyncStorage.setItem('codigoUsuario', response.data.codigo.toString());
      return response.data.codigo;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro de login:", error);
    throw new Error(error.response?.data?.message || 'Dados de login inválidos.');
  }
};

export const isAuthenticated = async () => {
  const codigoUsuario = await AsyncStorage.getItem('codigoUsuario');
  return !!codigoUsuario;
};

export const getCodigoUsuario = async () => {
  const codigo = await AsyncStorage.getItem('codigoUsuario');
  return codigo ? parseInt(codigo, 10) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem('codigoUsuario');
};

export const getUserDetails = async () => {
  try {
    const codigoUsuario = await getCodigoUsuario();
    if (!codigoUsuario) throw new Error('Usuário não autenticado.');

    const url = `${BASE_URL}/usuarios/${codigoUsuario}`;
    const response = await axios.get(url);

    console.log('Dados do usuário:', response.data);

    const { Latitude, Longitude } = response.data;

    if (Latitude && Longitude) {
      return { latitude: Latitude, longitude: Longitude };
    } else {
      throw new Error('Latitude e longitude não encontrados nos dados do usuário.');
    }
  } catch (error) {
    console.error('Erro ao buscar localização do usuário:', error);
    throw new Error('Não foi possível obter os detalhes do usuário.');
  }
};
