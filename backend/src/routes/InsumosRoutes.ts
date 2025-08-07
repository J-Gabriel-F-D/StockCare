import { Router } from "express";
import { InsumosController } from "../controllers/InsumosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

// Lista todos os insumos
router.get("/", (req, res) => {
  InsumosController.getInsumos(req, res);
});

// Cria um novo insumo
router.post("/", (req, res) => {
  InsumosController.createInsumo(req, res);
});

// Busca um insumo por ID
router.get("/:id", (req, res) => {
  InsumosController.getInsumoById(req, res);
});

// Atualiza um insumo existente
router.put("/:id", (req, res) => {
  InsumosController.updateInsumo(req, res);
});

// Deleta um insumo
router.delete("/:id", (req, res) => {
  InsumosController.deleteInsumo(req, res);
});

export default router;
