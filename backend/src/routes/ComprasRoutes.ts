import { Router } from "express";
import { ComprasController } from "../controllers/ComprasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

// Todas as rotas de compras exigem autenticação
router.use(autenticar);

// Rota para solicitar compra de insumos
router.post("/compras", ComprasController.solicitarCompra);

// Rota para listar pedidos de compra já realizados
router.get("/compras", ComprasController.listarPedidos);

export default router;
