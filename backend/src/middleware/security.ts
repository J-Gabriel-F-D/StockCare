import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Express } from "express";

export function setupSecurity(app: Express) {
  // Protege headers HTTP
  app.use(helmet());

  // Configura CORS
  app.use(
    cors({
      origin: ["http://localhost:5173"], // frontend
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  // // Limite de requisições (100 reqs por 15 min por IP)
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000,
  //   max: 1000,
  //   message: "Too many requests, please try again later.",
  // });

  // app.use(limiter);
}
