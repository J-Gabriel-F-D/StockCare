import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, cpf, matricula } = req.body;

    // Validação básica dos campos
    if (!nome || !email || !senha || !cpf || !matricula) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Verifica se o email já está cadastrado
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });
    if (emailExistente) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    // Verifica se o CPF já está cadastrado
    const cpfExistente = await prisma.usuario.findUnique({
      where: { cpf },
    });
    if (cpfExistente) {
      return res.status(400).json({ error: "CPF já cadastrado." });
    }

    // Verifica se a matrícula já está cadastrada
    const matriculaExistente = await prisma.usuario.findFirst({
      where: { matricula },
    });
    if (matriculaExistente) {
      return res.status(400).json({ error: "Matrícula já cadastrada." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cpf,
        matricula,
      },
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário: " + error });
  }
};

const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        matricula: true,
        criadoEm: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários: " + error });
  }
};

// Atualizar usuário
const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, matricula } = req.body;

    const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nome,
        email,
        senha: senhaHash,
        matricula,
      },
    });

    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário: " + error });
  }
};

// Deletar usuário
const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar usuário: " + error });
  }
};

export const UsuariosController = {
  createUsuario,
  getUsuarios,
  updateUsuario,
  deleteUsuario,
};
