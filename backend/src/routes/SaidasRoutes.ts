import { Router } from "express";
import { SaidasController } from "../controllers/SaidasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

router.post("/", (req, res) => {
  SaidasController.createSaida(req, res);
});

router.get("/", (req, res) => {
  SaidasController.getSaidas(req, res);
});

export default router;
