import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { addDays } from "date-fns";

const getAlertasValidade = async (req: Request, res: Response) => {
  try {
    const dias = parseInt(req.params.dias as string) || 30;

    const hoje = new Date();
    const dataLimite = addDays(hoje, dias);

    const entradasVencendo = await prisma.movimentacao.findMany({
      where: {
        tipo: "entrada",
        validade: {
          lte: dataLimite,
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

    res.status(200).json(entradasVencendo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar alertas de validade:" + error });
  }
};

export const AlertasController = { getAlertasValidade };
