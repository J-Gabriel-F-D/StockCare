import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createMovimentacao = async (req: Request, res: Response) => {
  try {
    const { tipo, quantidade, destino, insumoId } = req.body;
    if (!["entrada", "saida"].includes(tipo)) {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Deve ser "entrada" ou "saida".' });
    }

    const insumo = await prisma.insumo.findUnique({ where: { id: insumoId } });

    if (!insumo) {
      return res.status(404).json({ error: "Insumo não encontrado." });
    }

    if (tipo === "saida" && insumo.quantidade < quantidade) {
      return res
        .status(400)
        .json({ error: "Estoque insuficinete para saída." });
    }

    await prisma.insumo.update({
      where: {
        id: insumoId,
      },
      data: {
        quantidade:
          tipo === "entrada"
            ? insumo.quantidade + quantidade
            : insumo.quantidade - quantidade,
      },
    });
    const movimentacao = await prisma.movimentacao.create({
      data: {
        tipo,
        quantidade,
        destino: tipo === "saida" ? destino : null,
        insumoId,
      },
    });
    return res.status(201).json(movimentacao);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao registrar movimentação." });
  }
};

const getMovimentacoes = async (req: Request, res: Response) => {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
      include: { insumo: true },
      orderBy: { data: "desc" },
    });

    return res.status(201).json(movimentacoes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao listar movimentções. ${error}` });
  }
};

export const MovimentacoesController = { getMovimentacoes, createMovimentacao };
