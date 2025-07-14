import { Router } from "express";
import { AlertasController } from "../controllers/AlertasControllers";

const router = Router();

// Rota para buscar insumos com validade próxima
router.get("/validade", AlertasController.getAlertasValidade);

export default router;
