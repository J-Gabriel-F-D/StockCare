// services/fornecedoresService.ts
import api from "./api";

// Interface para representar um Fornecedor
export interface Fornecedor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  endereco?: string;
  contato?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criar/editar um Fornecedor
export interface FornecedorInput {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  endereco?: string;
  contato?: string;
}

export const fornecedoresService = {
  listar: async (termo?: string): Promise<Fornecedor[]> => {
    const res = await api.get("/fornecedores");
    return res.data;
  },

  buscarInteligente: async (termo: string): Promise<Fornecedor[]> => {
    try {
      const todosFornecedores = await fornecedoresService.listar();

      if (!termo.trim()) {
        return todosFornecedores;
      }

      const termoLower = termo.toLowerCase();

      return todosFornecedores.filter((fornecedor) => {
        // Busca por nome
        const nomeMatch = fornecedor.nome.toLowerCase().includes(termoLower);

        // Busca por CNPJ
        const cnpjMatch = fornecedor.cnpj.toLowerCase().includes(termoLower);

        // Busca por email
        const emailMatch = fornecedor.email.toLowerCase().includes(termoLower);

        // Busca por contato
        const contatoMatch =
          fornecedor.contato &&
          fornecedor.contato.toLowerCase().includes(termoLower);

        // Busca por ID
        const idMatch = fornecedor.id.toLowerCase().includes(termoLower);

        return nomeMatch || cnpjMatch || emailMatch || contatoMatch || idMatch;
      });
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw new Error("Não foi possível realizar a busca");
    }
  },

  // Função para buscar e classificar por relevância
  buscarComRelevancia: async (termo: string): Promise<Fornecedor[]> => {
    const todosFornecedores = await fornecedoresService.listar();

    if (!termo.trim()) {
      return todosFornecedores;
    }

    const termoLower = termo.toLowerCase();

    return todosFornecedores
      .map((fornecedor) => {
        let score = 0;

        // Verificar correspondência exata no nome (maior pontuação)
        if (fornecedor.nome.toLowerCase() === termoLower) {
          score += 10;
        }

        // Verificar correspondência parcial no nome
        if (fornecedor.nome.toLowerCase().includes(termoLower)) {
          score += 5;
        }

        // Verificar correspondência exata no CNPJ
        if (fornecedor.cnpj === termo) {
          score += 8;
        }

        // Verificar correspondência parcial no CNPJ
        if (fornecedor.cnpj.toLowerCase().includes(termoLower)) {
          score += 4;
        }

        // Verificar correspondência exata no email
        if (fornecedor.email.toLowerCase() === termoLower) {
          score += 6;
        }

        // Verificar correspondência parcial no email
        if (fornecedor.email.toLowerCase().includes(termoLower)) {
          score += 3;
        }

        // Verificar correspondência no contato
        if (
          fornecedor.contato &&
          fornecedor.contato.toLowerCase().includes(termoLower)
        ) {
          score += 2;
        }

        // Verificar correspondência no ID
        if (fornecedor.id.toLowerCase().includes(termoLower)) {
          score += 1;
        }

        return { fornecedor, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.fornecedor);
  },

  criar: async (fornecedor: FornecedorInput): Promise<Fornecedor> => {
    const res = await api.post("/fornecedores", fornecedor);
    return res.data;
  },

  atualizar: async (
    id: string,
    fornecedor: Partial<FornecedorInput>
  ): Promise<Fornecedor> => {
    const res = await api.put(`/fornecedores/${id}`, fornecedor);
    return res.data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/fornecedores/${id}`);
  },

  buscarPorId: async (id: string): Promise<Fornecedor> => {
    const res = await api.get(`/fornecedores/${id}`);
    return res.data;
  },
};
