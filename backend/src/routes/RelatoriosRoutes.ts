import { Router } from "express";
import { RelatoriosController } from "../controllers/RelatoriosController";

const router = Router();

router.get("/movimentacoes", (req, res) => {
  RelatoriosController.getRelatorioMovimentacoes(req, res);
});
router.get("/movimentacoes/export", (req, res) => {
  RelatoriosController.createRelatorio(req, res);
});

export default router;
