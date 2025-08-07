import { Router } from "express";
import { EstoqueController } from "../controllers/EstoqueController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

router.get("/", (req, res) => {
  EstoqueController.getEstoque(req, res);
});

export default router;
