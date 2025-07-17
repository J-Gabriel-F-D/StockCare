import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

const getInsumos = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumo.findMany();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar insumos", error });
  }
};

// Buscar um insumo por ID
const getInsumoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const insumo = await prisma.insumo.findUnique({
      where: { id: id },
    });
    if (!insumo) {
      return res.status(404).json({ message: "Insumo não encontrado" });
    }
    res.json(insumo);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar insumo", error });
  }
};

// Criar um novo insumo
const createInsumo = async (req: Request, res: Response) => {
  try {
    const novoInsumo = {
      nome: req.body.nome,
      descricao: req.body.descricao,
      unidadeMedida: req.body.unidadeMedida.toUpperCase(),
      precoUnitario: req.body.precoUnitario,
      fornecedorId: req.body.fornecedorId,
      quantidadeMinima: req.body.quantidadeMinima,
    };

    const insumoCriado = await prisma.insumo.create({
      data: novoInsumo,
    });

    res.status(201).json(insumoCriado);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao criar insumo", error });
  }
};

// Atualizar um insumo existente
const updateInsumo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newInsumo = req.body;

    // Verifica se o insumo existe antes de atualizar
    const insumo = await prisma.insumo.findUnique({
      where: { id: id },
    });
    if (!insumo) {
      return res.status(404).json({ message: "Insumo não encontrado" });
    }
    const insumoAtualizado = await prisma.insumo.update({
      where: { id: id },
      data: {
        nome: newInsumo.nome,
        descricao: newInsumo.descricao,
        unidadeMedida: newInsumo.unidadeMedida,
        precoUnitario: newInsumo.precoUnitario,
        quantidadeMinima: newInsumo.quantidadeMinima,
        fornecedor: {
          connect: { id: newInsumo.fornecedorId },
        },
      },
    });
    res.json(insumoAtualizado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar insumo", error });
  }
};

// Deletar um insumo
const deleteInsumo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const insumo = await prisma.insumo.findUnique({
      where: { id: id },
    });
    if (!insumo) {
      return res.status(404).json({ message: "Insumo não encontrado" });
    }
    await prisma.insumo.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar insumo", error });
  }
};

export const InsumosController = {
  getInsumos,
  getInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
};
