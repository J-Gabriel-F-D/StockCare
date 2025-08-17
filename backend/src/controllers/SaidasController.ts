import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { RequestWithUser } from "../@types/express";

const createSaida = async (req: RequestWithUser, res: Response) => {
  try {
    const { quantidade, destino, insumoId } = req.body;

    const insumo = await prisma.insumo.findUnique({ where: { id: insumoId } });
    if (!insumo) {
      return res.status(404).json({ error: "Insumo não encontrado." });
    }

    // Calcula estoque disponível
    const totalEntradas = await prisma.entrada.aggregate({
      where: { insumoId },
      _sum: { quantidade: true },
    });

    const totalSaidas = await prisma.saida.aggregate({
      where: { insumoId },
      _sum: { quantidade: true },
    });

    const estoqueAtual =
      (totalEntradas._sum.quantidade || 0) - (totalSaidas._sum.quantidade || 0);

    if (quantidade > estoqueAtual) {
      return res
        .status(400)
        .json({ error: "Quantidade insuficiente para saída." });
    }

    const saida = await prisma.saida.create({
      data: {
        quantidade,
        destino,
        insumoId,
        usuarioId: req.usuario?.id!,
      },
    });

    return res.status(201).json(saida);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar saída." });
  }
};

const getSaidas = async (req: Request, res: Response) => {
  try {
    const saidas = await prisma.saida.findMany({
      include: {
        insumo: true,
        usuario: {
          select: {
            nome: true,
            email: true,
            matricula: true,
          },
        },
      },
      orderBy: { data: "desc" },
    });

    return res.status(200).json(saidas);
  } catch (error) {
    return res.status(500).json({ error: `Erro ao listar saídas. ${error}` });
  }
};

export const SaidasController = { createSaida, getSaidas };
