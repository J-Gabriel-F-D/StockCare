import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import axios from "axios";

const solicitarCompra = async (req: Request, res: Response) => {
  const { insumoId, quantidade } = req.body;

  try {
    // Cria o registro de pedido no banco
    const pedido = await prisma.pedidoCompra.create({
      data: {
        insumoId,
        quantidade,
        status: "PENDENTE",
      },
    });

    // Simula integração com sistema externo de compras
    try {
      await axios.post("http://localhost:4000/api/compras/novo-pedido", {
        pedidoId: pedido.id,
        insumoId,
        quantidade,
      });

      // Atualiza status do pedido após integração
      await prisma.pedidoCompra.update({
        where: { id: pedido.id },
        data: { status: "ENVIADO" },
      });
    } catch (error) {
      console.error("Erro ao integrar com sistema de compras:", error);
    }

    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Erro ao solicitar compra." });
  }
};

const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await prisma.pedidoCompra.findMany({
      include: { insumo: true },
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar pedidos de compra." });
  }
};

export const ComprasController = { solicitarCompra, listarPedidos };
