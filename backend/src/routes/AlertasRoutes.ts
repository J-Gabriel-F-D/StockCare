import { Router } from "express";
import { AlertasController } from "../controllers/AlertasControllers";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   - name: Alertas
 *     description: Sistema de alertas e notificações do estoque
 */

/**
 * @swagger
 * /alertas/validade/{dias}:
 *   get:
 *     summary: Busca insumos com validade próxima
 *     description: Retorna uma lista de insumos que vencerão dentro do número de dias especificado
 *     tags:
 *       - Alertas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dias
 *         required: true
 *         description: Número de dias para alerta de validade
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           example: 30
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
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria do insumo
 *       - in: query
 *         name: critico
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas insumos críticos
 *     responses:
 *       200:
 *         description: Lista de insumos com validade próxima
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alertas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AlertaValidade'
 *                 totalAlertas:
 *                   type: integer
 *                 alertasCriticos:
 *                   type: integer
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
 *       400:
 *         description: Parâmetro de dias inválido
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/alertas/validade/:dias", AlertasController.getAlertasValidade);

/**
 * @swagger
 * components:
 *   schemas:
 *     AlertaValidade:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         lote:
 *           type: string
 *         quantidade:
 *           type: integer
 *         dataValidade:
 *           type: string
 *           format: date
 *         diasParaVencimento:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [CRITICO, ALERTA, NORMAL]
 *         categoria:
 *           type: string
 *         localizacao:
 *           type: string
 *         fornecedor:
 *           type: string
 *         ultimaEntrada:
 *           type: string
 *           format: date
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
