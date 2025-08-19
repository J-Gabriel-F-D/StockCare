import { Router } from "express";
import { InsumosController } from "../controllers/InsumosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

// Lista todos os insumos
router.get("/insumos", (req, res) => {
  InsumosController.getInsumos(req, res);
});

// Cria um novo insumo
router.post("/insumos", (req, res) => {
  InsumosController.createInsumo(req, res);
});

// Busca um insumo por ID
router.get("/insumos/:id", (req, res) => {
  InsumosController.getInsumoById(req, res);
});

// Atualiza um insumo existente
router.put("/insumos/:id", (req, res) => {
  InsumosController.updateInsumo(req, res);
});

// Deleta um insumo
router.delete("/insumos/:id", (req, res) => {
  InsumosController.deleteInsumo(req, res);
});

export default router;
