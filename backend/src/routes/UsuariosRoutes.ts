import { Router } from "express";
import { UsuariosController } from "../controllers/UsuariosController";
import { autenticar } from "../middleware/AuthMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cadastra um novo usuário no sistema (normalmente requer permissões administrativas)
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *       409:
 *         description: Conflito - email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/usuarios", (req, res) => {
  UsuariosController.createUsuario(req, res);
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados no sistema
 *     tags:
 *       - Usuarios
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
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status do usuário (true para ativos)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, USUARIO, ESTOQUISTA]
 *         description: Filtrar por perfil de acesso
 *     responses:
 *       200:
 *         description: Lista de usuários obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
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
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - requer permissão de administrador
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/usuarios", (req, res) => {
  UsuariosController.getUsuarios(req, res);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     description: Atualiza os dados de um usuário específico
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do usuário a ser atualizado
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdateInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados de entrada inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - só é possível atualizar o próprio usuário ou requer permissão de admin
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/usuarios/:id", autenticar, (req, res) => {
  UsuariosController.updateUsuario(req, res);
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Desativa ou remove permanentemente um usuário do sistema
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único do usuário a ser removido
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Usuário removido/desativado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário removido com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - requer permissão de administrador
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/usuarios/:id", autenticar, (req, res) => {
  UsuariosController.deleteUsuario(req, res);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [ADMIN, USUARIO, ESTOQUISTA]
 *         ativo:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UsuarioInput:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - role
 *       properties:
 *         nome:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@email.com"
 *         senha:
 *           type: string
 *           format: password
 *           example: "senhaSegura123"
 *         role:
 *           type: string
 *           enum: [ADMIN, USUARIO, ESTOQUISTA]
 *           example: "USUARIO"
 *
 *     UsuarioUpdateInput:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           example: "João Silva Santos"
 *         email:
 *           type: string
 *           format: email
 *           example: "novo.email@exemplo.com"
 *         senha:
 *           type: string
 *           format: password
 *           example: "novaSenhaSegura456"
 *         role:
 *           type: string
 *           enum: [ADMIN, USUARIO, ESTOQUISTA]
 *           example: "ESTOQUISTA"
 *         ativo:
 *           type: boolean
 *           example: true
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
