import express from "express";
import insumosRoutes from "./routes/InsumosRoutes";
import fornecedoresRoutes from "./routes/FornecedoresRoutes";
import movimentacaoRouter from "./routes/MovimentacoesRoutes";

const app = express();

app.use(express.json());
app.use("/insumos", insumosRoutes);
app.use("/fornecedores", fornecedoresRoutes);
app.use("/movimentacoes", movimentacaoRouter);

export default app;
