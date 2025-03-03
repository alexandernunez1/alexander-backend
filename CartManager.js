import fs from 'fs';

class CartManager{
    constructor(pathFile){
      this.pathFile = pathFile;
    }

    // Método para agregar un nuevo carrito
    async addCart(newCart) {
      try {
        // Leer el contenido del archivo de carritos
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        // Convertir el contenido del archivo a un arreglo de carritos
        const carts = JSON.parse(data);
        // Asignar un ID único al nuevo carrito basado en la cantidad de carritos existentes
        newCart.id = carts.length + 1;
        // Agregar el nuevo carrito al arreglo de carritos
        carts.push(newCart);
        // Sobrescribir el archivo de carritos con el nuevo carrito agregado
        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
        // Devolver el carrito recién agregado
        return newCart;
      } catch (error) {
        // Lograr el error en la consola si ocurre un problema al agregar el carrito
        console.error('Error al agregar carrito:', error);
        // Re-lanzar el error para que pueda ser manejado en el nivel superior
        throw error;
      }
    }

    // Método para obtener un carrito por su ID
    async getCartById(id) {
      try {
        // Leer el contenido del archivo de carritos
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        // Convertir el contenido del archivo a un arreglo de carritos
        const carts = JSON.parse(data);
        // Buscar el carrito específico por su ID
        return carts.find((cart) => cart.id === id);
      } catch (error) {
        // Lograr el error en la consola si ocurre un problema al obtener el carrito por ID
        console.error('Error al obtener carrito por ID:', error);
        // Re-lanzar el error para que pueda ser manejado en el nivel superior
        throw error;
      }
    }

    // Método para agregar un producto a un carrito específico
    async addProductInCartById(id, product) {
      try {
        // Leer el contenido del archivo de carritos
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        // Convertir el contenido del archivo a un arreglo de carritos
        let carts = JSON.parse(data);
        // Encontrar el índice del carrito específico por su ID
        const index = carts.findIndex((cart) => cart.id === id);
        // Si el carrito es encontrado, agregar el producto a su lista de productos
        if (index !== -1) {
          carts[index].products.push(product);
          // Sobrescribir el archivo de carritos con el producto agregado
          await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
          // Devolver el carrito actualizado
          return carts[index];
        } else {
          // Si el carrito no es encontrado, lanzar un error
          throw new Error('Carrito no encontrado');
        }
      } catch (error) {
        // Lograr el error en la consola si ocurre un problema al agregar el producto al carrito
        console.error('Error al agregar producto al carrito:', error);
        // Re-lanzar el error para que pueda ser manejado en el nivel superior
        throw error;
      }
    }
  }
  
  export default CartManager;