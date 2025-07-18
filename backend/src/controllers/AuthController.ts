import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        matricula: usuario.matricula,
      },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        matricula: usuario.matricula,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login: " + error });
  }
};

export const AuthController = { login };
