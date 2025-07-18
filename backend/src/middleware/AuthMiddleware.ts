import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function autenticar(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    ) as {
      id: string;
      nome: string;
      email: string;
      matricula: number;
    };

    req.usuario = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      matricula: decoded.matricula,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
