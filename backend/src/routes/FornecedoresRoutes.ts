import { Router } from "express";
import { FornecedoresController } from "../controllers/FornecedoresController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

// Lista todos os fornecedores
router.get("/fornecedores", (req, res) => {
  FornecedoresController.getFornecedores(req, res);
});

// Busca fornecedor por ID
router.get("/fornecedores/:id", (req, res) => {
  FornecedoresController.getFornecedorByID(req, res);
});

// Cria um novo fornecedor
router.post("/fornecedores", (req, res) => {
  FornecedoresController.criarFornecedor(req, res);
});

// Atualiza um fornecedor existente
router.put("/fornecedores/:id", (req, res) => {
  FornecedoresController.atualizarFornecedor(req, res);
});

// Deleta um fornecedor
router.delete("/fornecedores/:id", (req, res) => {
  FornecedoresController.removerFornecedor(req, res);
});

export default router;
