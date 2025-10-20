import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticacao
 *     description: Endpoints para autenticação de usuários
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Realiza o login do usuário e retorna um token JWT
 *     tags:
 *       - Autenticacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email e senha são obrigatórios"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email ou senha incorretos"
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/login", (req, res) => {
  AuthController.login(req, res);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "usuario@exemplo.com"
 *         senha:
 *           type: string
 *           format: password
 *           example: "senhaSegura123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         usuario:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *         expiraEm:
 *           type: integer
 *           description: Tempo de expiração do token em segundos
 *           example: 3600
 */

export default router;
