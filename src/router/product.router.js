import express from "express";
import ProductManager from "../ProductManager.js";
import { v4 as uuidv4 } from 'uuid'; // Importa la función para generar UUID

//instaciamos el router de express para manejar las rutas
const productsRouter = express.Router();
//instaciamos el manejador de nuestro archivo de productos
const productManager = new ProductManager("./src/data/product.json");

// ... lógica para listar todos los productos ...
productsRouter.get("/", async (req, res) => {
  try {
    const data = await productManager.getProducts();
    res.status(200).json(data); // Devuelve la lista de productos con estado 200
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los productos",
      message: error.message,
    });
  }
});

// ... lógica para obtener un producto por id ...
productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductsById(pid);
    if (product) {
      res.status(200).json(product); // Devuelve el producto encontrado con estado 200
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el producto por ID",
      message: error.message,
    });
  }
});

// ... lógica para agregar un nuevo producto ...
productsRouter.post("/", async (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body }; // Genera un UUID
  try {
    const createdProduct = await productManager.addProduct(newProduct); // Agrega el nuevo producto
    res.status(201).json(createdProduct); // Devuelve el producto creado con estado 201
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al agregar el producto", message: error.message });
  }
});


// ... lógica para actualizar un producto ...
productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const updatedProduct = await productManager.setProductById(pid, req.body); // Actualiza el producto
    res.status(200).json(updatedProduct); // Devuelve el producto actualizado con estado 200
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar el producto",
      message: error.message,
    });
  }
});

// ... lógica para eliminar un producto ...
productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProductById(pid); // Elimina el producto
    res.status(204).send(); // Responde con un estado 204 No Content
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto", message: error.message });
  }
});

export default productsRouter;
