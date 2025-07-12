import { Router } from "express";
import { EstoqueController } from "../controllers/EstoqueController";

const router = Router();

router.get("/", (req, res) => {
  EstoqueController.getEstoque(req, res);
});

export default router;
