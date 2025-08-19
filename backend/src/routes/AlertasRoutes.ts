import { Router } from "express";
import { AlertasController } from "../controllers/AlertasControllers";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

// Rota para buscar insumos com validade próxima
router.get("/alertas/validade/:dias", AlertasController.getAlertasValidade);

export default router;
