import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StockCare API",
      version: "1.0.0",
      description:
        "Documentação da API do sistema de gerenciamento de estoque de insumos médicos",
    },
    servers: [{ url: "http://localhost:3000/api" }],
  },
  apis: ["./src/routes/*.ts"], // os arquivos que contêm as rotas
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
