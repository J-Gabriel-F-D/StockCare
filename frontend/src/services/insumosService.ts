import api from "./api";
import type { Estoque } from "./estoqueService";

// Interface para representar um Insumo
export interface Insumo {
  id: string;
  nome: string;
  descricao?: string;
  unidadeMedida: string;
  precoUnitario: number;
  fornecedorId?: string;
  quantidadeMinima?: number;
  codigoBarras?: string;
  createdAt?: Date;
  updatedAt?: Date;
  quantidadeEmEstoque?: number;
}

// Interface para criar/editar um Insumo
export interface InsumoInput {
  nome: string;
  descricao?: string;
  unidadeMedida: string;
  precoUnitario: number;
  fornecedorId?: string;
  quantidadeMinima?: number;
  codigoBarras?: string;
}

export const insumosService = {
  listar: async (termo?: string): Promise<Insumo[]> => {
    const [resInsumos, resEstoque] = await Promise.all([
      api.get("/insumos"),
      api.get<Estoque[]>("/estoque"),
    ]);

    const insumos: Insumo[] = resInsumos.data;
    const estoques: Estoque[] = resEstoque.data;

    return insumos.map((insumo) => ({
      ...insumo,
      quantidadeEmEstoque: estoques.find(
        (e) => e.codigoBarras === insumo.codigoBarras
      )?.quantidadeAtual,
    }));
  },
  buscarInteligente: async (termo: string): Promise<Insumo[]> => {
    try {
      const todosInsumos = await insumosService.listar();

      if (!termo.trim()) {
        return todosInsumos;
      }

      const termoLower = termo.toLowerCase();

      // Detectar automaticamente o tipo de busca
      const isCodigoBarras = /^\d+$/.test(termo); // Se contém apenas números
      const isPossivelCodigo =
        termo.length >= 5 && /^[a-zA-Z0-9]+$/.test(termo); // Se é alfanumérico e tem pelo menos 5 caracteres

      return todosInsumos.filter((insumo) => {
        // Priorizar busca exata por código de barras se for numérico
        if (isCodigoBarras && insumo.codigoBarras) {
          return insumo.codigoBarras.includes(termo);
        }

        // Busca por código de barras parcial
        if (isPossivelCodigo && insumo.codigoBarras) {
          return insumo.codigoBarras.toLowerCase().includes(termoLower);
        }

        // Busca por nome (com prioridade)
        const nomeMatch = insumo.nome.toLowerCase().includes(termoLower);

        // Busca por descrição
        const descricaoMatch =
          insumo.descricao &&
          insumo.descricao.toLowerCase().includes(termoLower);

        // Busca por ID
        const idMatch = insumo.id.toLowerCase().includes(termoLower);

        return nomeMatch || descricaoMatch || idMatch;
      });
    } catch (error) {
      console.error("Erro ao buscar insumos:", error);
      throw new Error("Não foi possível realizar a busca");
    }
  },

  // Função para buscar e classificar por relevância
  buscarComRelevancia: async (termo: string): Promise<Insumo[]> => {
    const todosInsumos = await insumosService.listar();

    if (!termo.trim()) {
      return todosInsumos;
    }

    const termoLower = termo.toLowerCase();

    return todosInsumos
      .map((insumo) => {
        let score = 0;

        // Verificar correspondência exata no nome (maior pontuação)
        if (insumo.nome.toLowerCase() === termoLower) {
          score += 10;
        }

        // Verificar correspondência parcial no nome
        if (insumo.nome.toLowerCase().includes(termoLower)) {
          score += 5;
        }

        // Verificar correspondência exata no código de barras
        if (insumo.codigoBarras && insumo.codigoBarras === termo) {
          score += 8;
        }

        // Verificar correspondência parcial no código de barras
        if (
          insumo.codigoBarras &&
          insumo.codigoBarras.toLowerCase().includes(termoLower)
        ) {
          score += 4;
        }

        // Verificar correspondência na descrição
        if (
          insumo.descricao &&
          insumo.descricao.toLowerCase().includes(termoLower)
        ) {
          score += 2;
        }

        // Verificar correspondência no ID
        if (insumo.id.toLowerCase().includes(termoLower)) {
          score += 1;
        }

        return { insumo, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)

      .map((item) => item.insumo);
  },
  buscarPorId: async (id: string): Promise<Insumo> => {
    const [resInsumo, resEstoque] = await Promise.all([
      api.get(`/insumos/id/${id}`), // Alterado para usar o endpoint específico por ID
      api.get<Estoque[]>("/estoque"),
    ]);

    const insumo: Insumo = resInsumo.data;
    const estoques: Estoque[] = resEstoque.data;

    return {
      ...insumo,
      quantidadeEmEstoque: estoques.find(
        (e) => e.codigoBarras === insumo.codigoBarras
      )?.quantidadeAtual,
    };
  },
  criar: async (insumo: InsumoInput): Promise<Insumo> => {
    const res = await api.post("/insumos", insumo);
    return res.data;
  },
  atualizar: async (
    id: string,
    insumo: Partial<InsumoInput>
  ): Promise<Insumo> => {
    const res = await api.put(`/insumos/${id}`, insumo);
    return res.data;
  },
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/insumos/${id}`);
  },
};
