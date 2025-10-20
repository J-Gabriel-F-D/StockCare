// services/entradasService.ts
import api from "./api";

// Interface para representar uma Entrada
export interface Entrada {
  id: string;
  quantidade: number;
  data: string;
  insumoId: string;
  usuarioId: string;
  insumo: {
    id: string;
    nome: string;
    unidadeMedida: string;
    codigoBarras?: string;
  };
  usuario: {
    nome: string;
    email: string;
    matricula: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Interface para criar uma Entrada
export interface EntradaInput {
  quantidade: number;
  insumoId: string;
}

export const entradasService = {
  listar: async (): Promise<Entrada[]> => {
    const res = await api.get("/entrada");
    return res.data;
  },

  buscarPorId: async (id: string): Promise<Entrada> => {
    const entradas = await entradasService.listar();

    const res = entradas.find((entrada) => entrada.id === id);

    if (!res) {
      throw new Error(`Entrada com id ${id} não encontrada`);
    }
    return res;
  },

  buscarPorData: async (data: string): Promise<Entrada[]> => {
    try {
      const todasEntradas = await entradasService.listar();

      if (!data.trim()) {
        return todasEntradas;
      }

      // Filtra as entradas pela data (formato YYYY-MM-DD)
      return todasEntradas.filter((entrada) => entrada.data.includes(data));
    } catch (error) {
      console.error("Erro ao buscar entradas por data:", error);
      throw new Error("Não foi possível realizar a busca por data");
    }
  },

  criar: async (entrada: EntradaInput): Promise<Entrada> => {
    const res = await api.post("/entrada", entrada);
    return res.data;
  },
};
