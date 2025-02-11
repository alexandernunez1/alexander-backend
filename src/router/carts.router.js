import express from "express";
import CartManager from "../../CartManager.js";

//instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
//instanciamos el manejador de nuestro archivo de carrito
const cartManager = new CartManager("./src/data/cart.json");

//POST "/" - Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart(req.body); // Agregamos un nuevo carrito
    res.status(201).json(newCart); // Devuelve el carrito creado con estado 201
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear carrito", message: error.message });
  }
});

//GET "/:cid" - Obtener un carrito por ID
cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid); // Buscamos el carrito por ID
    if (cart) {
      res.status(200).json(cart); // Devuelve el carrito encontrado con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener carrito por ID",
        message: error.message,
      });
  }
});

//POST "/:cid/product/:pid" - Agregar un producto a un carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.addProductInCartById(cid, req.body); // Agregamos el producto al carrito
    if (updatedCart) {
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado con estado 200
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al agregar producto al carrito",
        message: error.message,
      });
  }
});

export default cartRouter;
