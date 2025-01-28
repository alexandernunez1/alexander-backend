import fs from "fs";

class ProductManager {
  constructor(pathfile) {
    this.pathfile = pathfile;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.pathfile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer productos:", error);
      throw error;
    }
  }

  async getProductsById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === id);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      product.id = products.length + 1;
      products.push(product);
      await fs.promises.writeFile(
        this.pathfile,
        JSON.stringify(products, null, 2)
      );
      return product;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async setProductById(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index] = updatedProduct;
        await fs.promises.writeFile(
          this.pathfile,
          JSON.stringify(products, null, 2)
        );
        return updatedProduct;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        await fs.promises.writeFile(
          this.pathfile,
          JSON.stringify(products, null, 2)
        );
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }
}

export default ProductManager;
