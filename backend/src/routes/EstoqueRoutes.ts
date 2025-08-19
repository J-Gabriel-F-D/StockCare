import { Router } from "express";
import { EstoqueController } from "../controllers/EstoqueController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Estoque
 *   description: Consulta e gestão de níveis de estoque
 */

/**
 * @swagger
 * /estoque:
 *   get:
 *     summary: Consulta o estoque de insumos
 *     description: Retorna a situação atual do estoque com informações detalhadas dos insumos
 *     tags: [Estoque]
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
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria do insumo
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do insumo (busca parcial)
 *       - in: query
 *         name: estoqueMinimo
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas insumos abaixo do estoque mínimo
 *       - in: query
 *         name: estoqueCritico
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas insumos em estoque crítico
 *       - in: query
 *         name: ordenarPor
 *         schema:
 *           type: string
 *           enum: [nome, quantidade, categoria, atualizado]
 *           default: nome
 *         description: Campo para ordenação dos resultados
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Direção da ordenação
 *     responses:
 *       200:
 *         description: Dados do estoque obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estoque:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ItemEstoque'
 *                 totais:
 *                   type: object
 *                   properties:
 *                     totalItens:
 *                       type: integer
 *                       example: 150
 *                     abaixoMinimo:
 *                       type: integer
 *                       example: 5
 *                     emEstoqueCritico:
 *                       type: integer
 *                       example: 2
 *                     valorTotalEstoque:
 *                       type: number
 *                       format: float
 *                       example: 12500.75
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
router.get("/estoque", (req, res) => {
  EstoqueController.getEstoque(req, res);
});

// Definição dos schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     ItemEstoque:
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
 *         categoria:
 *           type: string
 *           example: "Material de fixação"
 *         quantidadeAtual:
 *           type: integer
 *           example: 85
 *         estoqueMinimo:
 *           type: integer
 *           example: 50
 *         estoqueMaximo:
 *           type: integer
 *           example: 200
 *         unidadeMedida:
 *           type: string
 *           example: "unidade"
 *         custoUnitario:
 *           type: number
 *           format: float
 *           example: 2.50
 *         valorTotal:
 *           type: number
 *           format: float
 *           example: 212.50
 *         status:
 *           type: string
 *           enum: [NORMAL, ABAIXO_MINIMO, CRITICO, ACIMA_MAXIMO]
 *           example: "NORMAL"
 *         ultimaEntrada:
 *           type: string
 *           format: date-time
 *           example: "2024-01-10T14:30:00.000Z"
 *         ultimaSaida:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T09:45:00.000Z"
 *         fornecedorPrincipal:
 *           type: string
 *           example: "Fornecedor XYZ Ltda"
 *         localizacao:
 *           type: string
 *           example: "Prateleira A-15"
 *         loteAtual:
 *           type: string
 *           example: "LOTE-2024-001"
 *         dataValidade:
 *           type: string
 *           format: date
 *           example: "2025-01-10"
 *         movimentacoes30dias:
 *           type: integer
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
