import fs from 'fs';

class CartManager{
    constructor(pathFile){
      this.pathFile = pathFile;
    }

    async addCart(newCart) {
      try {
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        const carts = JSON.parse(data);
        newCart.id = carts.length + 1;
        carts.push(newCart);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
        return newCart;
      } catch (error) {
        console.error('Error al agregar carrito:', error);
        throw error;
      }
    }

    async getCartById(id) {
      try {
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        const carts = JSON.parse(data);
        return carts.find((cart) => cart.id === id);
      } catch (error) {
        console.error('Error al obtener carrito por ID:', error);
        throw error;
      }
    }

    async addProductInCartById(id, product) {
      try {
        const data = await fs.promises.readFile(this.pathFile, 'utf8');
        let carts = JSON.parse(data);
        const index = carts.findIndex((cart) => cart.id === id);
        if (index !== -1) {
          carts[index].products.push(product);
          await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
          return carts[index];
        } else {
          throw new Error('Carrito no encontrado');
        }
      } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        throw error;
      }
    }
  }
  
  export default CartManager;