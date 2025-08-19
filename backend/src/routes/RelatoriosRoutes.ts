import { Router } from "express";
import { RelatoriosController } from "../controllers/RelatoriosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

router.get("/relatorios/movimentacoes", (req, res) => {
  RelatoriosController.getRelatorioMovimentacoes(req, res);
});
router.get("/relatorios/movimentacoes/export", (req, res) => {
  RelatoriosController.createRelatorio(req, res);
});
router.get("/relatorios/insumos-criticos", (req, res) => {
  RelatoriosController.getInsumosCriticos(req, res);
});
router.get("/relatorios/insumos-criticos/export", (req, res) => {
  RelatoriosController.exportInsumosCriticos(req, res);
});
router.get("/relatorios/inventario", (req, res) => {
  RelatoriosController.getInventario(req, res);
});
router.get("/relatorios/inventario/export", (req, res) => {
  RelatoriosController.exportInventario(req, res);
});
export default router;
