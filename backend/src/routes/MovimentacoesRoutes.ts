import { Router } from "express";
import { MovimentacoesController } from "../controllers/MovimentacoesController";

const movimentacaoRouter = Router();

movimentacaoRouter.post("/", (req, res) => {
  MovimentacoesController.createMovimentacao(req, res);
});

movimentacaoRouter.get("/", (req, res) => {
  MovimentacoesController.getMovimentacoes(req, res);
});

export default movimentacaoRouter;
