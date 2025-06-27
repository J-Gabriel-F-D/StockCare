import express from "express";
import insumosRoutes from "./routes/InsumosRoutes";
import fornecedoresRoutes from "./routes/FornecedoresRoutes";

const app = express();

app.use(express.json());
app.use("/insumos", insumosRoutes);
app.use("/fornecedores", fornecedoresRoutes);

export default app;
