import { Router } from "express";
import { RelatoriosController } from "../controllers/RelatoriosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   - name: Relatorios
 *     description: Geração de relatórios do sistema
 */

/**
 * @swagger
 * /relatorios/movimentacoes:
 *   get:
 *     summary: Relatório de movimentações
 *     description: Gera relatório de todas as movimentações de estoque
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período (YYYY-MM-DD)
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ENTRADA, SAIDA, TODOS]
 *         description: Tipo de movimentação
 *       - in: query
 *         name: insumoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID do insumo
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 movimentacoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MovimentacaoRelatorio'
 *                 totalizadores:
 *                   type: object
 *                   properties:
 *                     totalEntradas:
 *                       type: integer
 *                     totalSaidas:
 *                       type: integer
 *                     saldoPeriodo:
 *                       type: integer
 */
router.get("/relatorios/movimentacoes", (req, res) => {
  RelatoriosController.getRelatorioMovimentacoes(req, res);
});

/**
 * @swagger
 * /relatorios/movimentacoes/export:
 *   get:
 *     summary: Exportar relatório de movimentações
 *     description: Exporta relatório de movimentações em formato CSV ou XLSX
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial do período (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final do período (YYYY-MM-DD)
 *       - in: query
 *         name: formato
 *         schema:
 *           type: string
 *           enum: [CSV, XLSX]
 *           default: CSV
 *         description: Formato de exportação
 *     responses:
 *       200:
 *         description: Arquivo exportado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/relatorios/movimentacoes/export", (req, res) => {
  RelatoriosController.createRelatorio(req, res);
});

/**
 * @swagger
 * /relatorios/insumos-criticos:
 *   get:
 *     summary: Relatório de insumos críticos
 *     description: Lista insumos com estoque crítico ou próximo do vencimento
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ESTOQUE, VALIDADE, TODOS]
 *           default: TODOS
 *         description: Tipo de critério para insumos críticos
 *       - in: query
 *         name: diasValidade
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 30
 *         description: Dias para considerar validade crítica
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insumosCriticos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InsumoCritico'
 *                 total:
 *                   type: integer
 *                   description: Total de insumos em situação crítica
 */
router.get("/relatorios/insumos-criticos", (req, res) => {
  RelatoriosController.getInsumosCriticos(req, res);
});

/**
 * @swagger
 * /relatorios/insumos-criticos/export:
 *   get:
 *     summary: Exportar relatório de insumos críticos
 *     description: Exporta relatório de insumos críticos em formato CSV ou XLSX
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ESTOQUE, VALIDADE, TODOS]
 *           default: TODOS
 *         description: Tipo de critério para insumos críticos
 *       - in: query
 *         name: formato
 *         schema:
 *           type: string
 *           enum: [CSV, XLSX]
 *           default: CSV
 *         description: Formato de exportação
 *     responses:
 *       200:
 *         description: Arquivo exportado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/relatorios/insumos-criticos/export", (req, res) => {
  RelatoriosController.exportInsumosCriticos(req, res);
});

/**
 * @swagger
 * /relatorios/inventario:
 *   get:
 *     summary: Relatório de inventário
 *     description: Gera relatório completo do inventário atual
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: ordenarPor
 *         schema:
 *           type: string
 *           enum: [nome, quantidade, categoria, valor]
 *           default: nome
 *         description: Campo para ordenação
 *     responses:
 *       200:
 *         description: Relatório de inventário gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventario:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ItemInventario'
 *                 totalizadores:
 *                   type: object
 *                   properties:
 *                     totalItens:
 *                       type: integer
 *                     valorTotal:
 *                       type: number
 *                     format: float
 */
router.get("/relatorios/inventario", (req, res) => {
  RelatoriosController.getInventario(req, res);
});

/**
 * @swagger
 * /relatorios/inventario/export:
 *   get:
 *     summary: Exportar relatório de inventário
 *     description: Exporta relatório de inventário em formato CSV ou XLSX
 *     tags:
 *       - Relatorios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         schema:
 *           type: string
 *           enum: [CSV, XLSX]
 *           default: CSV
 *         description: Formato de exportação
 *     responses:
 *       200:
 *         description: Arquivo exportado com sucesso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/relatorios/inventario/export", (req, res) => {
  RelatoriosController.exportInventario(req, res);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     MovimentacaoRelatorio:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         data:
 *           type: string
 *           format: date-time
 *         tipo:
 *           type: string
 *           enum: [ENTRADA, SAIDA]
 *         insumo:
 *           type: string
 *         quantidade:
 *           type: integer
 *         lote:
 *           type: string
 *         usuario:
 *           type: string
 *         destino:
 *           type: string
 *
 *     InsumoCritico:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         quantidadeAtual:
 *           type: integer
 *         quantidadeMinima:
 *           type: integer
 *         statusEstoque:
 *           type: string
 *           enum: [CRITICO, BAIXO, ADEQUADO]
 *         dataValidade:
 *           type: string
 *           format: date
 *         diasParaVencimento:
 *           type: integer
 *         statusValidade:
 *           type: string
 *           enum: [VENCIDO, CRITICO, ALERTA, OK]
 *
 *     ItemInventario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         categoria:
 *           type: string
 *         quantidade:
 *           type: integer
 *         quantidadeMinima:
 *           type: integer
 *         unidadeMedida:
 *           type: string
 *         valorUnitario:
 *           type: number
 *           format: float
 *         valorTotal:
 *           type: number
 *           format: float
 *         localizacao:
 *           type: string
 *         ultimaMovimentacao:
 *           type: string
 *           format: date
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
