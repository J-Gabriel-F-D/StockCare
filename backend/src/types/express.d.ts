import { Usuario } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        nome: string;
        email: string;
        matricula: number;
      };
    }
  }
}
