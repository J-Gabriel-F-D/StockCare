import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { differenceInDays } from "date-fns";

const getAlertasValidade = async (req: Request, res: Response) => {
  try {
    const dias = parseInt(req.params.dias) || 30;
    const hoje = new Date();

    const movimentacoes = await prisma.movimentacao.findMany({
      where: {
        tipo: "entrada",
        validade: {
          not: null,
          gte: hoje,
        },
      },
      include: {
        insumo: {
          include: {
            fornecedor: true,
          },
        },
      },
      orderBy: {
        validade: "asc",
      },
    });

    // calcula dias restantes e filtra no JS
    const resultado = movimentacoes
      .map((mov) => {
        const diasRestantes = differenceInDays(new Date(mov.validade!), hoje);
        return {
          id: mov.insumo.id,
          insumo: mov.insumo.nome,
          quantidade: mov.quantidade,
          validade: mov.validade,
          fornecedor: mov.insumo.fornecedor?.nome || "N/A",
          tipo: mov.tipo,
          diasRestantes,
        };
      })
      .filter((mov) => mov.diasRestantes <= dias);

    res.status(200).json(resultado);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar alertas de validade: " + error });
  }
};

export const AlertasController = { getAlertasValidade };
