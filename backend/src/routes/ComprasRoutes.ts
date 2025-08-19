import { Router } from "express";
import { ComprasController } from "../controllers/ComprasController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

// Todas as rotas de compras exigem autenticação
router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Gerenciamento de solicitações de compra de insumos
 */

/**
 * @swagger
 * /compras:
 *   post:
 *     summary: Solicita compra de insumos
 *     description: Cria uma nova solicitação de compra de insumos para o setor de compras
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitacaoCompraInput'
 *     responses:
 *       201:
 *         description: Solicitação de compra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoCompra'
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
 *       404:
 *         description: Insumo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/compras", ComprasController.solicitarCompra);

/**
 * @swagger
 * /compras:
 *   get:
 *     summary: Lista pedidos de compra
 *     description: Retorna uma lista de todos os pedidos de compra solicitados
 *     tags: [Compras]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, ENVIADO, RECEBIDO, CANCELADO]
 *         description: Filtrar por status do pedido
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
 *         description: Data inicial para filtrar pedidos (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar pedidos (YYYY-MM-DD)
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID do usuário que solicitou
 *     responses:
 *       200:
 *         description: Lista de pedidos de compra obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoCompra'
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
router.get("/compras", ComprasController.listarPedidos);

// Definição dos schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     PedidoCompra:
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
 *           example: 100
 *         status:
 *           type: string
 *           enum: [PENDENTE, ENVIADO, RECEBIDO, CANCELADO]
 *           example: "PENDENTE"
 *         prioridade:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA, URGENTE]
 *           example: "MEDIA"
 *         justificativa:
 *           type: string
 *           example: "Estoque abaixo do nível mínimo"
 *         usuarioId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         dataSolicitacao:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         dataEnvio:
 *           type: string
 *           format: date-time
 *           example: "2024-01-16T09:15:00.000Z"
 *         dataRecebimento:
 *           type: string
 *           format: date-time
 *           example: "2024-01-18T14:20:00.000Z"
 *         observacoes:
 *           type: string
 *           example: "Pedido enviado para o fornecedor XYZ"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         insumo:
 *           $ref: '#/components/schemas/Insumo'
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *
 *     SolicitacaoCompraInput:
 *       type: object
 *       required:
 *         - insumoId
 *         - quantidade
 *         - justificativa
 *       properties:
 *         insumoId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           example: 100
 *         justificativa:
 *           type: string
 *           example: "Estoque abaixo do nível mínimo"
 *         prioridade:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA, URGENTE]
 *           example: "MEDIA"
 *         observacoes:
 *           type: string
 *           example: "Preferência por fornecedor ABC"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
