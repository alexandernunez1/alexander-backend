import express from "express";
import ProductManager from "../../ProductManager.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/data/product.json"); // Se ha cambiado la ruta del archivo de productos

viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products }); // Se ha agregado { products } para pasar los productos a la vista
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default viewsRouter;
