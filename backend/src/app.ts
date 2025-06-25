import express from "express";
import insumosRoutes from "./routes/InsumosRoutes";

const app = express();

app.use(express.json());
app.use("/insumos", insumosRoutes);

export default app;
