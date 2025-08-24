// src/services/usuariosService.ts
import api from "./api";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  matricula: number;
  cpf: string;
  senha?: string; // só usada no cadastro
};

export const usuariosService = {
  listar: async (): Promise<Usuario[]> => {
    const res = await api.get("/usuarios");
    return res.data;
  },
  criar: async (usuario: Omit<Usuario, "id">): Promise<Usuario> => {
    const res = await api.post("/usuarios", usuario);
    return res.data;
  },
  atualizar: async (
    id: string,
    usuario: Partial<Usuario>
  ): Promise<Usuario> => {
    const res = await api.put(`/usuarios/${id}`, usuario);
    return res.data;
  },
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};
