import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const getEstoque = async (req: Request, res: Response) => {
  try {
    const insumos = await prisma.insumo.findMany({
      include: {
        Movimentacao: true,
        fornecedor: true,
      },
    });
    const estoque = insumos.map((insumo) => {
      const entradas = insumo.Movimentacao.filter(
        (mov) => mov.tipo === "entrada"
      ).reduce((acc, mov) => acc + mov.quantidade, 0);
      const saidas = insumo.Movimentacao.filter(
        (mov) => mov.tipo === "saida"
      ).reduce((acc, mov) => acc + mov.quantidade, 0);

      return {
        id: insumo.id,
        nome: insumo.nome,
        unidadeMedida: insumo.unidadeMedida,
        quantidadeAtual: entradas - saidas,
        fornecedor: insumo.fornecedor?.nome ?? "N/A",
      };
    });

    res.status(200).json(estoque);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estoque", error });
  }
};

export const EstoqueController = { getEstoque };
