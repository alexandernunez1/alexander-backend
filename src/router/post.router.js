import express from "express";
import Post from "../models/post.model.js";

const postRouter = express.Router();

// Ruta para crear un nuevo post
postRouter.post("/", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text) {
      return res.status(400).send({ status: "error", message: "Datos del post incompletos" });
    }
    const response = await Post.create({ userId, text });
    res.status(201).send({ status: "success", payload: response });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Ruta para obtener todos los posts
postRouter.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts.length === 0) {
      return res.status(404).send({ status: "error", message: "No se encontraron posts" });
    }
    res.status(200).send({ status: "success", payload: posts });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default postRouter;
