import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/usuarios", (req, res) => {
  UsuariosController.createUsuario(req, res);
});
router.get("/usuarios", (req, res) => {
  UsuariosController.getUsuarios(req, res);
});
router.put("/usuarios/:id", autenticar, (req, res) => {
  UsuariosController.updateUsuario(req, res);
});
router.delete("/usuarios/:id", autenticar, (req, res) => {
  UsuariosController.deleteUsuario(req, res);
});

export default router;
