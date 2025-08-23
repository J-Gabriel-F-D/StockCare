import { Router } from "express";
import { InsumosController } from "../controllers/InsumosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Insumos
 *   description: Gerenciamento de Insumos
 */

/**
 * @swagger
 * /insumos:
 *   get:
 *     summary: Lista todos os insumos
 *     tags: [Insumos]
 *     responses:
 *       200:
 *         description: Retorna a lista de insumos
 */
router.get("/insumos", autenticar, (req, res) => {
  InsumosController.getInsumos(req, res);
});

/**
 * @swagger
 * /insumos:
 *   post:
 *     summary: Cadastra um novo insumo
 *     tags: [Insumos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Insumo criado com sucesso
 */
router.post("/insumos", autenticar, (req, res) => {
  InsumosController.createInsumo(req, res);
});

/**
 * @swagger
 * /insumos/{id}:
 *   get:
 *     summary: Busca um insumo pelo ID
 *     description: Retorna os detalhes de um insumo específico baseado no seu ID
 *     tags:
 *       - Insumos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do insumo
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Insumo encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insumo'
 *       404:
 *         description: Insumo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Insumo não encontrado"
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/insumos/:id", autenticar, (req, res) => {
  InsumosController.getInsumoById(req, res);
});

/**
 * @swagger
 * /insumos/{id}:
 *   put:
 *     summary: Atualiza um insumo existente
 *     description: Atualiza os dados de um insumo específico
 *     tags:
 *       - Insumos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do insumo a ser atualizado
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InsumoInput'
 *     responses:
 *       200:
 *         description: Insumo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insumo'
 *       400:
 *         description: Dados de entrada inválidos
 *       404:
 *         description: Insumo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/insumos/:id", autenticar, (req, res) => {
  InsumosController.updateInsumo(req, res);
});

/**
 * @swagger
 * /insumos/{id}:
 *   delete:
 *     summary: Deleta um insumo
 *     description: Remove permanentemente um insumo do sistema
 *     tags:
 *       - Insumos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do insumo a ser deletado
 *         schema:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Insumo deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Insumo deletado com sucesso"
 *       404:
 *         description: Insumo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/insumos/:id", autenticar, (req, res) => {
  InsumosController.deleteInsumo(req, res);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Insumo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nome:
 *           type: string
 *           example: "Parafuso sextavado"
 *         descricao:
 *           type: string
 *           example: "Parafuso de aço inox 5mm"
 *         quantidadeEstoque:
 *           type: integer
 *           example: 100
 *         unidadeMedida:
 *           type: string
 *           example: "unidade"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     InsumoInput:
 *       type: object
 *       required:
 *         - nome
 *         - quantidadeEstoque
 *       properties:
 *         nome:
 *           type: string
 *           example: "Parafuso sextavado"
 *         descricao:
 *           type: string
 *           example: "Parafuso de aço inox 5mm"
 *         quantidadeEstoque:
 *           type: integer
 *           example: 150
 *         unidadeMedida:
 *           type: string
 *           example: "unidade"
 */

export default router;
