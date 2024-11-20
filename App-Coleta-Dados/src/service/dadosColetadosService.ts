import axios from 'axios';
import DadosColetados from "@/core/dadosColetados";

interface ApiResponse {
  seq: number;
  codigo: number;
  DataHora: string;
  Tipo: number;
  Valor1: number;
  Valor2: number;
  EmCasa: boolean;
}

const BASE_URL = "https://apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app";

export const fetchDados = async (codigoUsuario: number): Promise<DadosColetados[]> => {
  try {
    const url = `${BASE_URL}/dados?codigo=${codigoUsuario}`;
    const response = await axios.get<ApiResponse[]>(url);

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(dados => 
        new DadosColetados(
          dados.seq ?? null,
          dados.codigo ?? 0,
          dados.DataHora ?? "",
          dados.Tipo ?? 0,
          dados.Valor1 ?? 0,
          dados.Valor2 ?? 0,
          dados.EmCasa ?? false
        )
      );
    }

    console.error("Resposta não contém dados válidos.");
    return [];
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};

export const cadastrarDados = async (dados: DadosColetados): Promise<DadosColetados> => {
  try {
    const urlCompleta = `${BASE_URL}/dados`;
    console.log("Enviando dados para a URL:", urlCompleta);
    console.log("Dados a serem enviados:", dados);

    if (!dados || !dados.codigo || !dados.dataHora || dados.Tipo === undefined) {
      console.error("Erro: Dados incompletos ou inválidos", dados);
      return;
    }

    const response = await axios.post<DadosColetados>(urlCompleta, dados);
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

export const atualizarDados = async (dados: DadosColetados): Promise<DadosColetados> => {
  try {
    if (dados.Tipo === 3) {
      dados.Valor2 = 0;
    }
    
    const response = await axios.put<DadosColetados>(`${BASE_URL}/dados/${dados.seq}`, dados);

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar dados coletados:", error);
    throw error;
  }
};

export const excluirDados = async (seq: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/dados/${seq}`);
  } catch (error) {
    console.error("Erro ao excluir dados coletados:", error);
    throw error;
  }
};
