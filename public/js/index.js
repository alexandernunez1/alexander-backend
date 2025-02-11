const socket = io();

const formNewProduct = document.getElementById("formNewProduct");

formNewProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(formNewProduct);
  const productData = {};

  formData.forEach((value, key) => {
    productData[key] = value;
  });

  socket.emit("newProduct", productData);
});

socket.on("productoAgregado", (newProduct) => {
  const listaProductos = document.getElementById("listaProductos");
  listaProductos.innerHTML += `<li>${newProduct.titulo} - ${newProduct.precio} - ${newProduct.descripcion} - ${newProduct.categoria} <button onclick="eliminarProducto(${newProduct.id})">Eliminar</button></li>`;
});
function eliminarProducto(productId) {
  socket.emit("deleteProduct", productId);
}

socket.on("productoEliminado", (productId) => {
  const listaProductos = document.getElementById("listaProductos");
  const productoEliminado = listaProductos.querySelector(`li[data-id='${productId}']`);
  if (productoEliminado) {
    listaProductos.removeChild(productoEliminado);
  }
});
