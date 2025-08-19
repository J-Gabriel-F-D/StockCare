import { Router } from "express";
import { SaidasController } from "../controllers/SaidasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Saidas
 *   description: Gerenciamento de saídas do estoque
 */

/**
 * @swagger
 * /saida:
 *   post:
 *     summary: Registra uma nova saída do estoque
 *     description: Cria um registro de saída de insumos do estoque (baixa de estoque)
 *     tags: [Saidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaidaInput'
 *     responses:
 *       201:
 *         description: Saída registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Saida'
 *       400:
 *         description: Dados de entrada inválidos ou estoque insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Estoque insuficiente para o insumo"
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *       404:
 *         description: Insumo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/saida", (req, res) => {
  SaidasController.createSaida(req, res);
});

/**
 * @swagger
 * /saida:
 *   get:
 *     summary: Lista todas as saídas do estoque
 *     description: Retorna uma lista de todos os registros de saída do estoque
 *     tags: [Saidas]
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
 *         description: Data inicial para filtrar saídas (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar saídas (YYYY-MM-DD)
 *       - in: query
 *         name: destino
 *         schema:
 *           type: string
 *         description: Filtrar por destino/setor da saída
 *     responses:
 *       200:
 *         description: Lista de saídas obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saidas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Saida'
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
router.get("/saida", (req, res) => {
  SaidasController.getSaidas(req, res);
});

// Definição dos schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Saida:
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
 *           example: 5
 *         dataSaida:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T14:30:00.000Z"
 *         destino:
 *           type: string
 *           example: "Setor de Enfermagem"
 *         motivo:
 *           type: string
 *           example: "Atendimento de emergência"
 *         paciente:
 *           type: string
 *           example: "João da Silva"
 *         usuarioId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         observacoes:
 *           type: string
 *           example: "Saída realizada para procedimento de urgência"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         insumo:
 *           $ref: '#/components/schemas/Insumo'
 *
 *     SaidaInput:
 *       type: object
 *       required:
 *         - insumoId
 *         - quantidade
 *         - destino
 *         - motivo
 *       properties:
 *         insumoId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         destino:
 *           type: string
 *           example: "Setor de Enfermagem"
 *         motivo:
 *           type: string
 *           example: "Atendimento de emergência"
 *         paciente:
 *           type: string
 *           example: "João da Silva"
 *         observacoes:
 *           type: string
 *           example: "Saída realizada para procedimento de urgência"
 *         lote:
 *           type: string
 *           example: "LOTE-2024-001"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
