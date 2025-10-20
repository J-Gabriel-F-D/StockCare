// services/saidasService.ts
import api from "./api";

// Interface para representar uma Saída
export interface Saida {
  id: string;
  quantidade: number;
  destino: string;
  data: string;
  insumoId: string;
  usuarioId: string;
  insumo: {
    id: string;
    nome: string;
    unidadeMedida: string;
  };
  usuario: {
    nome: string;
    email: string;
    matricula: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Interface para criar uma Saída
export interface SaidaInput {
  quantidade: number;
  destino: string;
  insumoId: string;
}

export const saidasService = {
  listar: async (): Promise<Saida[]> => {
    const res = await api.get("/saida");
    return res.data;
  },

  buscarPorId: async (id: string): Promise<Saida> => {
    const saidas = saidasService.listar();
    const res = (await saidas).find((saida) => saida.id === id);

    if (!res) {
      throw new Error(`Saída com id ${id} não encontrada`);
    }

    return res;
  },

  buscarPorData: async (data: string): Promise<Saida[]> => {
    try {
      const todasSaidas = await saidasService.listar();

      if (!data.trim()) {
        return todasSaidas;
      }

      // Filtra as saídas pela data (formato YYYY-MM-DD)
      return todasSaidas.filter((saida) => saida.data.includes(data));
    } catch (error) {
      console.error("Erro ao buscar saídas por data:", error);
      throw new Error("Não foi possível realizar a busca por data");
    }
  },

  criar: async (saida: SaidaInput): Promise<Saida> => {
    const res = await api.post("/saida", saida);
    return res.data;
  },
};
