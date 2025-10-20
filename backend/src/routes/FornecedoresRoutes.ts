import { Router } from "express";
import { FornecedoresController } from "../controllers/FornecedoresController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fornecedores
 *   description: Gerenciamento de fornecedores
 */

/**
 * @swagger
 * /fornecedores:
 *   get:
 *     summary: Lista todos os fornecedores
 *     description: Retorna uma lista de todos os fornecedores cadastrados no sistema
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fornecedores obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fornecedor'
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/fornecedores", autenticar, (req, res) => {
  FornecedoresController.getFornecedores(req, res);
});

/**
 * @swagger
 * /fornecedores/{id}:
 *   get:
 *     summary: Busca fornecedor por ID
 *     description: Retorna os detalhes de um fornecedor específico baseado no seu ID
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do fornecedor
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Fornecedor encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/fornecedores/:id", autenticar, (req, res) => {
  FornecedoresController.getFornecedorByID(req, res);
});

/**
 * @swagger
 * /fornecedores:
 *   post:
 *     summary: Cria um novo fornecedor
 *     description: Cadastra um novo fornecedor no sistema
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorInput'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/fornecedores", autenticar, (req, res) => {
  FornecedoresController.criarFornecedor(req, res);
});

/**
 * @swagger
 * /fornecedores/{id}:
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     description: Atualiza os dados de um fornecedor específico
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do fornecedor a ser atualizado
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FornecedorInput'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/fornecedores/:id", autenticar, (req, res) => {
  FornecedoresController.atualizarFornecedor(req, res);
});

/**
 * @swagger
 * /fornecedores/{id}:
 *   delete:
 *     summary: Deleta um fornecedor
 *     description: Remove permanentemente um fornecedor do sistema
 *     tags: [Fornecedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do fornecedor a ser deletado
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Fornecedor deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Fornecedor deletado com sucesso"
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       404:
 *         description: Fornecedor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/fornecedores/:id", autenticar, (req, res) => {
  FornecedoresController.removerFornecedor(req, res);
});

// Definição dos schemas (adicione no components do Swagger)
/**
 * @swagger
 * components:
 *   schemas:
 *     Fornecedor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nome:
 *           type: string
 *           example: "Fornecedor XYZ Ltda"
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-90"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           format: email
 *           example: "contato@fornecedorxyz.com.br"
 *         endereco:
 *           type: string
 *           example: "Rua das Flores, 123 - São Paulo/SP"
 *         contato:
 *           type: string
 *           example: "João Silva"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     FornecedorInput:
 *       type: object
 *       required:
 *         - nome
 *         - cnpj
 *         - telefone
 *         - email
 *       properties:
 *         nome:
 *           type: string
 *           example: "Fornecedor XYZ Ltda"
 *         cnpj:
 *           type: string
 *           example: "12.345.678/0001-90"
 *         telefone:
 *           type: string
 *           example: "(11) 99999-9999"
 *         email:
 *           type: string
 *           format: email
 *           example: "contato@fornecedorxyz.com.br"
 *         endereco:
 *           type: string
 *           example: "Rua das Flores, 123 - São Paulo/SP"
 *         contato:
 *           type: string
 *           example: "João Silva"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
