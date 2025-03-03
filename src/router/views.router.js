import express from "express";
import ProductManager from "../../ProductManager.js";
import CartManager from "../../CartManager.js";

// Creamos un router de express para manejar las rutas relacionadas con las vistas
const viewsRouter = express.Router();
// Instanciamos el gestor de productos, pasando la ruta del archivo de productos
const productManager = new ProductManager("./src/data/product.json");

// Ruta para obtener la vista de inicio
viewsRouter.get("/", async (req, res) => {
  try {
    // Intentamos obtener los productos del gestor de productos
    const products = await productManager.getProducts();
    // Renderizamos la vista de inicio, pasando los productos obtenidos
    res.render("home", { products });
  } catch (error) {
    // Si ocurre un error, enviamos un mensaje de error con el estado 500
    res.status(500).send({ message: error.message });
  }
});

// Ruta para obtener la vista de productos en tiempo real
viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    // Intentamos obtener los productos del gestor de productos
    const products = await productManager.getProducts();
    // Renderizamos la vista de productos en tiempo real, pasando los productos obtenidos
    res.render("realTimeProducts", { products });
  } catch (error) {
    // Si ocurre un error, enviamos un mensaje de error con el estado 500
    res.status(500).send({ message: error.message });
  }
});

// Ruta para obtener la vista de productos con paginación
viewsRouter.get("/products", async (req, res) => {
  try {
    // Obtenemos el número de página y el tamaño de la página de la consulta
    const { page = 1, limit = 10 } = req.query;
    // Intentamos obtener los productos del gestor de productos con paginación
    const products = await productManager.getProducts({ page, limit });
    // Renderizamos la vista de productos con paginación, pasando los productos obtenidos
    res.render("products", { products });
  } catch (error) {
    // Si ocurre un error, enviamos un mensaje de error con el estado 500
    res.status(500).send({ message: error.message });
  }
});

// Ruta para obtener la vista de un producto específico
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    // Obtenemos el ID del producto de la solicitud
    const { pid } = req.params;
    // Intentamos obtener el producto del gestor de productos
    const product = await productManager.getProductById(pid);
    // Renderizamos la vista del producto, pasando el producto obtenido
    res.render("product", { product });
  } catch (error) {
    // Si ocurre un error, enviamos un mensaje de error con el estado 500
    res.status(500).send({ message: error.message });
  }
});

// Ruta para obtener la vista de un carrito específico
viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    // Obtenemos el ID del carrito de la solicitud
    const { cid } = req.params;
    // Intentamos obtener el carrito del gestor de carritos
    const cart = await cartManager.getCartById(cid);
    // Renderizamos la vista del carrito, pasando el carrito obtenido
    res.render("cart", { cart });
  } catch (error) {
    // Si ocurre un error, enviamos un mensaje de error con el estado 500
    res.status(500).send({ message: error.message });
  }
});

viewsRouter.get("/registro", (req, res)=> {
  res.render("registro");
})

viewsRouter.get("/post", (req, res)=> {
  res.render("post");
})


// Exportamos el router de vistas para que pueda ser utilizado en otras partes de la aplicación
export default viewsRouter;
