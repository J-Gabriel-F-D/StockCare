import api from "./api";

export interface Estoque {
  codigoBarras: string;
  nome: string;
  unidadeMedida: string;
  quantidadeAtual: number;
}

export const estoqueService = {
  getEstoque: async (codigoBarras: string): Promise<Estoque | undefined> => {
    const response = await api.get<Estoque[]>("/estoque");
    const insumos = response.data;
    return insumos.find((item) => item.codigoBarras === codigoBarras);
  },
};
