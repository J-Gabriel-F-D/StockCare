import { Router } from "express";
import { MovimentacoesController } from "../controllers/MovimentacoesController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

router.post("/", (req, res) => {
  MovimentacoesController.createMovimentacao(req, res);
});

router.get("/", (req, res) => {
  MovimentacoesController.getMovimentacoes(req, res);
});

export default router;
