import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const getEstoque = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumo.findMany({
      include: {
        Entrada: true,
        Saida: true,
        fornecedor: true,
      },
    });

    const estoque = insumos.map((insumo) => {
      const totalEntradas = (insumo.Entrada ?? []).reduce(
        (acc, entrada) => acc + entrada.quantidade,
        0
      );
      const totalSaidas = (insumo.Saida ?? []).reduce(
        (acc, saida) => acc + saida.quantidade,
        0
      );

      return {
        codigoBarras: insumo.codigoBarras,
        nome: insumo.nome,
        unidadeMedida: insumo.unidadeMedida,
        quantidadeAtual: totalEntradas - totalSaidas,
        fornecedor: insumo.fornecedor?.nome ?? "N/A",
      };
    });

    res.status(200).json(estoque);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estoque", error });
  }
};

export const EstoqueController = { getEstoque };
