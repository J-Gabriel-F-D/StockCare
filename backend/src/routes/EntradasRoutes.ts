import { Router } from "express";
import { EntradasController } from "../controllers/EntradasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Entradas
 *   description: Gerenciamento de entradas no estoque
 */

/**
 * @swagger
 * /entrada:
 *   post:
 *     summary: Registra uma nova entrada no estoque
 *     description: Cria um registro de entrada de insumos no estoque
 *     tags: [Entradas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntradaInput'
 *     responses:
 *       201:
 *         description: Entrada registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrada'
 *       400:
 *         description: Dados de entrada inválidos ou insumo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Quantidade deve ser maior que zero"
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/entrada", autenticar, (req, res) => {
  EntradasController.createEntrada(req, res);
});

/**
 * @swagger
 * /entrada:
 *   get:
 *     summary: Lista todas as entradas no estoque
 *     description: Retorna uma lista de todos os registros de entrada no estoque
 *     tags: [Entradas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: insumoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID do insumo
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar entradas (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar entradas (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de entradas obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entradas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entrada'
 *                 paginacao:
 *                   type: object
 *                   properties:
 *                     paginaAtual:
 *                       type: integer
 *                     totalPaginas:
 *                       type: integer
 *                     totalItens:
 *                       type: integer
 *                     hasProxima:
 *                       type: boolean
 *                     hasAnterior:
 *                       type: boolean
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/entrada", autenticar, (req, res) => {
  EntradasController.getEntradas(req, res);
});

// Definição dos schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Entrada:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         insumoId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           example: 50
 *         dataEntrada:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         lote:
 *           type: string
 *           example: "LOTE-2024-001"
 *         validade:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         fornecedorId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         usuarioId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         observacoes:
 *           type: string
 *           example: "Entrada realizada via nota fiscal 12345"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         insumo:
 *           $ref: '#/components/schemas/Insumo'
 *         fornecedor:
 *           $ref: '#/components/schemas/Fornecedor'
 *
 *     EntradaInput:
 *       type: object
 *       required:
 *         - insumoId
 *         - quantidade
 *         - fornecedorId
 *       properties:
 *         insumoId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           example: 50
 *         fornecedorId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         lote:
 *           type: string
 *           example: "LOTE-2024-001"
 *         validade:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         observacoes:
 *           type: string
 *           example: "Entrada realizada via nota fiscal 12345"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
