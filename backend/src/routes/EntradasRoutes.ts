import { Router } from "express";
import { EntradasController } from "../controllers/EntradasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

router.post("/", (req, res) => {
  EntradasController.createEntrada(req, res);
});

router.get("/", (req, res) => {
  EntradasController.getEntradas(req, res);
});

export default router;
