import { Router } from "express";
import { FornecedoresController } from "../controllers/FornecedoresController";

const router = Router();

// Lista todos os fornecedores
router.get("/", (req, res) => {
  FornecedoresController.getFornecedores(req, res);
});

// Busca fornecedor por ID
router.get("/:id", (req, res) => {
  FornecedoresController.getFornecedorByID(req, res);
});

// Cria um novo fornecedor
router.post("/", (req, res) => {
  FornecedoresController.criarFornecedor(req, res);
});

// Atualiza um fornecedor existente
router.put("/:id", (req, res) => {
  FornecedoresController.atualizarFornecedor(req, res);
});

// Deleta um fornecedor
router.delete("/:id", (req, res) => {
  FornecedoresController.removerFornecedor(req, res);
});

export default router;
