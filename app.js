import express from "express";
import cartsRouter from "./src/router/carts.router.js";
import productsRouter from "./src/router/product.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./src/router/views.router.js";
import { Socket } from "dgram";
import ProductManager from "./ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.static("public"));
app.use(express.json());
const PORT = 8080;

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/", viewsRouter);

const productManager = new ProductManager("./src/data/productos.js");
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("newProduct", async (datosProducto) => {
    try {
      const newProduct = await productManager.addProduct(datosProducto); // Corregido el nombre del método
      io.emit("productoAgregado", newProduct);
    } catch (error) {
      console.error("Error al agregar un producto:", error.message); // Corregido para mostrar el mensaje del error específico
    }
  });
});
// Inicio del servidor
server.listen(PORT, () =>
  console.log(`Servidor iniciado en: http://localhost:${PORT}`)
);
