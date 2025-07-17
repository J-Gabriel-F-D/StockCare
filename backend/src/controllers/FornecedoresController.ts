import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Listar todos os fornecedores
const getFornecedores = async (req: Request, res: Response) => {
  const fornecedores = await prisma.fornecedor.findMany();
  res.json(fornecedores);
};

// Buscar fornecedor por ID
const getFornecedorByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fornecedor = await prisma.fornecedor.findUnique({
    where: { id: String(id) },
  });
  if (!fornecedor) {
    return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
  }
  res.json(fornecedor);
};

// Criar novo fornecedor
const criarFornecedor = async (req: Request, res: Response) => {
  try {
    const novoFornecedor = {
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      cnpj: req.body.cnpj,
    };
    const fornecedorCriado = await prisma.fornecedor.create({
      data: novoFornecedor,
    });
    res.status(201).json(fornecedorCriado);
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao criar fornecedor", error });
  }
};

// Atualizar fornecedor
const atualizarFornecedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const novoFornecedor = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ mensagem: "ID inválido" });
    }
    const fornecedor = await prisma.fornecedor.findMany({
      where: { id: String(id) },
    });
    if (!fornecedor.some((f) => f.id === String(id))) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }
    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: { id: String(id) },
      data: novoFornecedor,
    });
    res.json(fornecedorAtualizado);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar fornecedor", error });
  }
};

// Remover fornecedor
const removerFornecedor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fornecedor = await prisma.fornecedor.findMany({
      where: { id: String(id) },
    });
    if (!fornecedor.some((f) => f.id === String(id))) {
      return res.status(404).json({ mensagem: "Fornecedor não encontrado" });
    }
    await prisma.fornecedor.delete({
      where: { id: String(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao remover fornecedor", error });
  }
};

export const FornecedoresController = {
  getFornecedores,
  getFornecedorByID,
  criarFornecedor,
  atualizarFornecedor,
  removerFornecedor,
};
