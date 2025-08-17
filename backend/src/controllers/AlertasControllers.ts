import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { differenceInDays } from "date-fns";

const getAlertasValidade = async (req: Request, res: Response) => {
  try {
    const dias = parseInt(req.params.dias) || 30;
    const hoje = new Date();

    const entradas = await prisma.entrada.findMany({
      where: {
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

    const resultado = entradas
      .map((entrada) => {
        const diasRestantes = differenceInDays(
          new Date(entrada.validade!),
          hoje
        );
        return {
          id: entrada.insumo.id,
          insumo: entrada.insumo.nome,
          quantidade: entrada.quantidade,
          validade: entrada.validade,
          fornecedor: entrada.insumo.fornecedor?.nome || "N/A",
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
