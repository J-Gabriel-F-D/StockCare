import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.post("/", (req, res) => {
  UsuariosController.createUsuario(req, res);
});
router.get("/", (req, res) => {
  UsuariosController.getUsuarios(req, res);
});
router.put("/:id", autenticar, (req, res) => {
  UsuariosController.updateUsuario(req, res);
});
router.delete("/:id", autenticar, (req, res) => {
  UsuariosController.deleteUsuario(req, res);
});

export default router;
