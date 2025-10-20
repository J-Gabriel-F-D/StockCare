// services/relatoriosService.ts
import api from "./api";

export interface MovimentacaoRelatorio {
  id: string;
  tipo: string;
  data: string;
  quantidade: number;
  destino: string;
  insumo: string;
  unidadeMedida: string;
  fornecedor: string;
}

export interface InsumoCritico {
  nome: string;
  unidade: string;
  atual: number;
  minimo: number;
  fornecedor: string;
}

export interface ItemInventario {
  id: string;
  nome: string;
  unidade: string;
  quantidadeAtual: number;
  fornecedor: string;
}

export interface FiltrosRelatorio {
  tipo?: string;
  codigoBarras?: string;
  inicio?: string;
  fim?: string;
  destino?: string;
  formato?: string;
}

export const relatoriosService = {
  getMovimentacoes: async (
    filtros: FiltrosRelatorio
  ): Promise<MovimentacaoRelatorio[]> => {
    const params = new URLSearchParams();

    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.codigoBarras)
      params.append("codigoBarras", filtros.codigoBarras);
    if (filtros.inicio) params.append("inicio", filtros.inicio);
    if (filtros.fim) params.append("fim", filtros.fim);
    if (filtros.destino) params.append("destino", filtros.destino);

    const res = await api.get(`/relatorios/movimentacoes?${params.toString()}`);
    return res.data;
  },

  getInsumosCriticos: async (
    codigoBarras?: string
  ): Promise<InsumoCritico[]> => {
    const params = new URLSearchParams();
    if (codigoBarras) params.append("codigoBarras", codigoBarras);

    const res = await api.get(
      `/relatorios/insumos-criticos?${params.toString()}`
    );
    return res.data;
  },

  getInventario: async (): Promise<ItemInventario[]> => {
    const res = await api.get("/relatorios/inventario");
    return res.data;
  },

  exportMovimentacoes: async (filtros: FiltrosRelatorio): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.codigoBarras)
      params.append("codigoBarras", filtros.codigoBarras);
    if (filtros.inicio) params.append("inicio", filtros.inicio);
    if (filtros.fim) params.append("fim", filtros.fim);
    if (filtros.destino) params.append("destino", filtros.destino);
    if (filtros.formato) params.append("formato", filtros.formato);

    const res = await api.get(
      `/relatorios/movimentacoes/export?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return res.data;
  },

  exportInsumosCriticos: async (
    formato: string,
    codigoBarras?: string
  ): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append("formato", formato);
    if (codigoBarras) params.append("codigoBarras", codigoBarras);

    const res = await api.get(
      `/relatorios/insumos-criticos/export?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return res.data;
  },

  exportInventario: async (formato: string): Promise<Blob> => {
    const res = await api.get(
      `/relatorios/inventario/export?formato=${formato}`,
      {
        responseType: "blob",
      }
    );
    return res.data;
  },
};
