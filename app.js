import express from "express";
import cartsRouter from "./src/router/carts.router.js";
import productsRouter from "./src/router/product.router.js";

const app = express();
app.use(express.json());
const PORT = 8080;

app.use('/api/carts', cartsRouter);
app.use("/api/products", productsRouter);

// Inicio del servidor
app.listen(PORT, () => console.log(`Servidor iniciado en: http://localhost:${PORT}`));