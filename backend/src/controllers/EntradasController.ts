import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { RequestWithUser } from "../@types/express";

const createEntrada = async (req: RequestWithUser, res: Response) => {
  try {
    const { quantidade, validade, insumoId } = req.body;

    const insumo = await prisma.insumo.findUnique({ where: { id: insumoId } });
    if (!insumo) {
      return res.status(404).json({ error: "Insumo não encontrado." });
    }

    const entrada = await prisma.entrada.create({
      data: {
        quantidade,
        validade: validade ? new Date(validade) : null,
        insumoId,
        usuarioId: req.usuario?.id!,
      },
    });

    return res.status(201).json(entrada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar entrada." });
  }
};

const getEntradas = async (req: Request, res: Response) => {
  try {
    const entradas = await prisma.entrada.findMany({
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

    return res.status(200).json(entradas);
  } catch (error) {
    return res.status(500).json({ error: `Erro ao listar entradas. ${error}` });
  }
};

export const EntradasController = { createEntrada, getEntradas };
