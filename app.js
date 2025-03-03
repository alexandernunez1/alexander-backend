import express from "express";
import cartsRouter from "./src/router/carts.router.js";
import productsRouter from "./src/router/product.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./src/router/views.router.js";
import ProductManager from "./ProductManager.js";
import userRouter from "./src/router/user.router.js";
import dotenv from "dotenv";
import connectMongoDB from "./src/db/db.js";
import postRouter from "./src/router/post.router.js"; // Importación del router de posts

dotenv.config();

const app = express();
connectMongoDB();

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
app.use("/api/users", userRouter);
app.use("/api/post", postRouter); // Uso del router de posts

const productManager = new ProductManager("./src/data/product.json");
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("newProduct", async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit("productoAgregado", newProduct);
    } catch (error) {
      console.error("Error al agregar un producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      const deletedProduct = await productManager.deleteProduct(productId);
      io.emit("productoEliminado", deletedProduct.id); // Emitir solo el id del producto eliminado
    } catch (error) {
      console.error("Error al eliminar un producto:", error.message);
    }
  });
});

// Inicio del servidor
server.listen(PORT, () =>
  console.log(`Servidor iniciado en: http://localhost:${PORT}`)
);
