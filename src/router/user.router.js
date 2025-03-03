import express from "express"; // Importamos el módulo express para crear una aplicación web
import User from "../models/user.model.js"; // Importamos el modelo de usuario para interactuar con la base de datos

const userRouter = express.Router(); // Creamos un router de express para manejar las rutas relacionadas con los usuarios

// Ruta para obtener todos los usuarios
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Intentamos encontrar todos los usuarios en la base de datos
    res.status(200).send({ status: "success", payload: users }); // Si se encuentran, los enviamos como respuesta con un estado de éxito
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al recuperar los usuarios: ${error.message}`,
    }); // Si ocurre un error, enviamos un mensaje de error con el estado 500
  }
});

// Ruta para agregar un nuevo usuario
userRouter.post("/", async (req, res) => {
  try {
    const { name, email, bio } = req.body; // Extraemos los datos del usuario del cuerpo de la solicitud
    if (!name || !email || !bio)
      return res
        .status(400)
        .send({ status: "error", message: "Datos del usuario incompleto" }); // Si falta algún dato, enviamos un mensaje de error con el estado 400

    const response = await User.create({ first_name, last_name, email }); // Intentamos agregar el nuevo usuario a la base de datos
    res.status(201).send({ status: "success", payload: response }); // Si se agrega correctamente, enviamos la respuesta con el estado 201
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al agregar el usuario: ${error.message}`,
    }); // Si ocurre un error, enviamos un mensaje de error con el estado 500
  }
});

// Ruta para modificar un usuario existente
userRouter.put("/:uid", async (req, res) => {
  try {
    const { uid } = req.params; // Extraemos el identificador del usuario de los parámetros de la solicitud
    const userUpdates = req.body; // Extraemos los datos de actualización del usuario del cuerpo de la solicitud

    const response = await User.findByIdAndUpdate(uid, userUpdates, {
      new: true,
    }); // Intentamos actualizar el usuario en la base de datos
    res.status(200).send({ status: "success", payload: response }); // Si se actualiza correctamente, enviamos la respuesta con el estado 200
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al modificar el usuario: ${error.message}`,
    }); // Si ocurre un error, enviamos un mensaje de error con el estado 500
  }
});

// Ruta para eliminar un usuario
userRouter.delete("/:uid", async (req, res) => {
  try {
    const { uid } = req.params; // Extraemos el identificador del usuario de los parámetros de la solicitud

    const response = await User.findByIdAndDelete(uid); // Intentamos eliminar el usuario de la base de datos
    res.status(200).send({ status: "success", payload: response }); // Si se elimina correctamente, enviamos la respuesta con el estado 200
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al eliminar el usuario: ${error.message}`,
    }); // Si ocurre un error, enviamos un mensaje de error con el estado 500
  }
});

export default userRouter; // Exportamos el router de usuarios para que pueda ser utilizado en otras partes de la aplicación
