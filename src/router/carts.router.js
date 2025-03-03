import express from "express";
import CartManager from "../../CartManager.js";
import ProductManager from "../../ProductManager.js"; // Importamos el manejador de productos

//instanciamos el router de express para manejar las rutas
const cartRouter = express.Router();
//instanciamos el manejador de nuestro archivo de carrito y productos
const cartManager = new CartManager("./src/data/cart.json");
const productManager = new ProductManager("./src/data/product.json");

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
    const cart = await cartManager.getCartById(cid).populate('products'); // Buscamos el carrito por ID y populamos los productos
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
    const updatedCart = await cartManager.addProductInCartById(cid, pid); // Agregamos el producto al carrito
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

//DELETE "/:cid" - Eliminar todos los productos del carrito
cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartManager.deleteCartById(cid); // Eliminamos el carrito
    res.status(204).send(); // Responde con un estado 204 No Content
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el carrito", message: error.message });
  }
});

//GET "/:cid/products" - Obtener los productos de un carrito
cartRouter.get("/:cid/products", async (req, res) => {
  const { cid } = req.params;
  const { limit = 10, page = 1, sort, query } = req.query; // Obtener los parámetros de consulta
  try {
    const cart = await cartManager.getCartById(cid).populate('products'); // Buscamos el carrito por ID y populamos los productos
    if (cart) {
      const products = cart.products;
      // Aplicamos el filtro a los productos si se proporciona
      let filteredProducts = products;
      if (query) {
        filteredProducts = products.filter(product => product[query] === req.query[query]);
      }
      // Ordenamos los productos según el parámetro de ordenamiento
      if (sort) {
        filteredProducts.sort((a, b) => {
          if (sort === 'asc') {
            return a.price - b.price;
          } else if (sort === 'desc') {
            return b.price - a.price;
          }
          return 0;
        });
      }
      // Aplicamos la paginación
      const offset = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      const totalPages = Math.ceil(filteredProducts.length / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevLink = hasPrevPage ? `/api/carts/${cid}/products?limit=${limit}&page=${prevPage}` : null;
      const nextLink = hasNextPage ? `/api/carts/${cid}/products?limit=${limit}&page=${nextPage}` : null;
      res.status(200).json({
        status: "success",
        payload: paginatedProducts,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink
      }); // Devuelve los productos del carrito filtrados, ordenados y paginados con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los productos del carrito",
        message: error.message,
      });
  }
});

//GET "/:cid/products/:filter" - Obtener los productos de un carrito con filtros
cartRouter.get("/:cid/products/:filter", async (req, res) => {
  const { cid, filter } = req.params;
  try {
    const cart = await cartManager.getCartById(cid).populate('products'); // Buscamos el carrito por ID y populamos los productos
    if (cart) {
      const products = cart.products;
      // Aplicamos el filtro a los productos
      const filteredProducts = products.filter(product => product[filter] === req.query[filter]);
      res.status(200).json(filteredProducts); // Devuelve los productos del carrito filtrados con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los productos del carrito con filtros",
        message: error.message,
      });
  }
});

//GET "/:cid/products/:filter/:sort" - Obtener los productos de un carrito con filtros y ordenamiento
cartRouter.get("/:cid/products/:filter/:sort", async (req, res) => {
  const { cid, filter, sort } = req.params;
  try {
    const cart = await cartManager.getCartById(cid).populate('products'); // Buscamos el carrito por ID y populamos los productos
    if (cart) {
      const products = cart.products;
      // Aplicamos el filtro a los productos
      const filteredProducts = products.filter(product => product[filter] === req.query[filter]);
      // Ordenamos los productos según el parámetro de ordenamiento
      const sortedProducts = filteredProducts.sort((a, b) => {
        if (req.query.order === 'asc') {
          return a[sort] - b[sort];
        } else if (req.query.order === 'desc') {
          return b[sort] - a[sort];
        }
        return 0;
      });
      res.status(200).json(sortedProducts); // Devuelve los productos del carrito filtrados y ordenados con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los productos del carrito con filtros y ordenamiento",
        message: error.message,
      });
  }
});

//GET "/:cid/products/:filter/:sort/:page" - Obtener los productos de un carrito con filtros, ordenamiento y paginación
cartRouter.get("/:cid/products/:filter/:sort/:page", async (req, res) => {
  const { cid, filter, sort, page } = req.params;
  try {
    const cart = await cartManager.getCartById(cid).populate('products'); // Buscamos el carrito por ID y populamos los productos
    if (cart) {
      const products = cart.products;
      // Aplicamos el filtro a los productos
      const filteredProducts = products.filter(product => product[filter] === req.query[filter]);
      // Ordenamos los productos según el parámetro de ordenamiento
      const sortedProducts = filteredProducts.sort((a, b) => {
        if (req.query.order === 'asc') {
          return a[sort] - b[sort];
        } else if (req.query.order === 'desc') {
          return b[sort] - a[sort];
        }
        return 0;
      });
      // Aplicamos la paginación
      const limit = 10; // Límite de productos por página
      const offset = (page - 1) * limit;
      const paginatedProducts = sortedProducts.slice(offset, offset + limit);
      const totalPages = Math.ceil(sortedProducts.length / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevLink = hasPrevPage ? `/api/carts/${cid}/products/${filter}/${sort}/${prevPage}` : null;
      const nextLink = hasNextPage ? `/api/carts/${cid}/products/${filter}/${sort}/${nextPage}` : null;
      res.status(200).json({
        status: "success",
        payload: paginatedProducts,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink
      }); // Devuelve los productos del carrito filtrados, ordenados y paginados con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al obtener los productos del carrito con filtros, ordenamiento y paginación",
        message: error.message,
      });
  }
});

//DELETE "/:cid/products/:pid" - Eliminar un producto del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.deleteProductInCartById(cid, pid); // Eliminamos el producto del carrito
    if (updatedCart) {
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado con estado 200
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al eliminar el producto del carrito",
        message: error.message,
      });
  }
});

//PUT "/:cid" - Actualizar un carrito
cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const updatedCart = await cartManager.updateCartById(cid, req.body); // Actualizamos el carrito
    if (updatedCart) {
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado con estado 200
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el carrito", message: error.message });
  }
});

//PUT "/:cid/products/:pid" - Actualizar la cantidad de un producto en el carrito
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.updateProductQuantityInCartById(cid, pid, req.body.quantity); // Actualizamos la cantidad del producto
    if (updatedCart) {
      res.status(200).json(updatedCart); // Devuelve el carrito actualizado con estado 200
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al actualizar la cantidad del producto en el carrito",
        message: error.message,
      });
  }
});

export default cartRouter;
