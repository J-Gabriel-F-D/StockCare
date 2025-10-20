import express from "express";
import { setupSwagger } from "./lib/swagger";

import insumosRoutes from "./routes/InsumosRoutes";
import fornecedoresRoutes from "./routes/FornecedoresRoutes";
import entradasRouter from "./routes/EntradasRoutes";
import estoqueRoutes from "./routes/EstoqueRoutes";
import alertaRoutes from "./routes/AlertasRoutes";
import relatoriosRoutes from "./routes/RelatoriosRoutes";
import usuariosRoutes from "./routes/UsuariosRoutes";
import authRouter from "./routes/AuthRotes";
import saidaRouter from "./routes/SaidasRoutes";
import comprasRoutes from "./routes/ComprasRoutes";
import { setupSecurity } from "./middleware/security";

const app = express();

setupSecurity(app);
setupSwagger(app);
app.use(express.json());

app.use("/api", insumosRoutes);
app.use("/api", fornecedoresRoutes);

app.use("/api", entradasRouter);
app.use("/api", saidaRouter);

app.use("/api", comprasRoutes);

app.use("/api", estoqueRoutes);
app.use("/api", alertaRoutes);
app.use("/api", relatoriosRoutes);
app.use("/api", usuariosRoutes);
app.use("/api", authRouter);

export default app;
