import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";

const router = Router();

router.post("/", (req, res) => {
  UsuariosController.createUsuario(req, res);
});
router.get("/", (req, res) => {
  UsuariosController.getUsuarios(req, res);
});
router.put("/:id", (req, res) => {
  UsuariosController.updateUsuario(req, res);
});
router.delete("/:id", (req, res) => {
  UsuariosController.deleteUsuario(req, res);
});

export { router as UsuariosRoutes };
