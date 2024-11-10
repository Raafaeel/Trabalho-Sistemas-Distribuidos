import axios from 'axios';
import DadosColetados from "@/core/dadosColetados";

interface ApiResponse {
  content: DadosColetados[];
}

const BASE_URL = "http://localhost:8080";

export const fetchDados = async (): Promise<DadosColetados[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}/dados-coletados`);
    return response.data.content;
  } catch (error) {
    console.error("Erro ao buscar dados coletados:", error);
    throw error;
  }
};

export const cadastrarDados = async (dados: DadosColetados): Promise<DadosColetados> => {
  try {
    const response = await axios.post<DadosColetados>(`${BASE_URL}/dados-coletados`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar dados coletados:", error);
    throw error;
  }
};

export const atualizarDados = async (dados: DadosColetados): Promise<DadosColetados> => {
  try {
    const response = await axios.put<DadosColetados>(
      `${BASE_URL}/dados-coletados/${dados.seq}`,
      dados
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar dados coletados:", error);
    throw error;
  }
};

export const excluirDados = async (seq: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/dados-coletados/${seq}`);
  } catch (error) {
    console.error("Erro ao excluir dados coletados:", error);
    throw error;
  }
};
