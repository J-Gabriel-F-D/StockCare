import express from "express";
import insumosRoutes from "./routes/InsumosRoutes";
import fornecedoresRoutes from "./routes/FornecedoresRoutes";
import entradasRouter from "./routes/EntradasRoutes";
import estoqueRoutes from "./routes/EstoqueRoutes";
import alertaRoutes from "./routes/AlertasRoutes";
import relatoriosRoutes from "./routes/RelatoriosRoutes";
import usuariosRoutes from "./routes/UsuariosRoutes";
import authRouter from "./routes/AuthRotes";
import saidaRouter from "./routes/SaidasRoutes";

const app = express();

app.use(express.json());

app.use("/insumos", insumosRoutes);
app.use("/fornecedores", fornecedoresRoutes);

app.use("/entrada", entradasRouter);
app.use("/saida", saidaRouter);

app.use("/estoque", estoqueRoutes);
app.use("/alertas", alertaRoutes);
app.use("/relatorios", relatoriosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/login", authRouter);

export default app;
