import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const createMovimentacao = async (req: Request, res: Response) => {
  try {
    const { tipo, quantidade, destino, validade, insumoId } = req.body;
    if (!["entrada", "saida"].includes(tipo)) {
      return res
        .status(400)
        .json({ error: 'Tipo inválido. Deve ser "entrada" ou "saida".' });
    }

    const insumo = await prisma.insumo.findUnique({ where: { id: insumoId } });

    console.log(insumo, "id: ", insumoId);

    if (!insumo) {
      return res.status(404).json({ error: "Insumo não encontrado." });
    }

    if (tipo === "saida") {
      const movimentacoes = await prisma.movimentacao.findMany({
        where: { insumoId },
      });

      const totalEntradas = movimentacoes
        .filter((m) => m.tipo === "entrada")
        .reduce((acc, m) => acc + m.quantidade, 0);

      const totalSaidas = movimentacoes
        .filter((m) => m.tipo === "saida")
        .reduce((acc, m) => acc + m.quantidade, 0);

      if (quantidade > totalEntradas - totalSaidas) {
        return res
          .status(400)
          .json({ error: "Quantidade insuficiente para saída." });
      }
    }

    const movimentacao = await prisma.movimentacao.create({
      data: {
        tipo,
        quantidade,
        destino: tipo === "saida" ? destino : null,
        validade: tipo === "entrada" ? new Date(validade) : null,
        insumoId,
        usuarioId: req.usuario?.id!,
      },
    });
    return res.status(201).json(movimentacao);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Erro ao registrar movimentação." });
  }
};

const getMovimentacoes = async (req: Request, res: Response) => {
  try {
    const movimentacoes = await prisma.movimentacao.findMany({
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

    return res.status(201).json(movimentacoes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Erro ao listar movimentções. ${error}` });
  }
};

export const MovimentacoesController = { getMovimentacoes, createMovimentacao };
