import axios from 'axios';

const BASE_URL = "https://apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app";

export const fetchDados = async (codigoUsuario) => {
  try {
    const url = `${BASE_URL}/dados?codigo=${codigoUsuario}`;
    const response = await axios.get(url);

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(dados => ({
        seq: dados.seq ?? null,
        codigo: dados.codigo ?? 0,
        dataHora: dados.DataHora ?? "",
        tipo: dados.Tipo ?? 0,
        valor1: dados.Valor1 ?? 0,
        valor2: dados.Valor2 ?? 0,
        emCasa: dados.EmCasa ?? false
      }));
    }

    console.error("Resposta não contém dados válidos.");
    return [];
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export const cadastrarDados = async (dados) => {
  try {
    const urlCompleta = `${BASE_URL}/dados`;
    console.log("Enviando dados para a URL:", urlCompleta);
    console.log("Dados a serem enviados:", dados);

    const response = await axios.post(urlCompleta, dados);
    console.log("Resposta recebida:", response);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao fazer requisição:", error.response?.data);
      console.error("Detalhes do erro:", error);
      if (error.response) {
        console.log("Erro no servidor:", error.response.status, error.response.data);
      }
    } else {
      console.error("Erro inesperado:", error);
    }
    throw error;
  }
};
