import mongoose from "mongoose";
import Indexacion from "../models/indexacion.model.js";
import Vino from "../models/varietal.model.js";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conectado correctamente a MongoDB!");


    //guardamos un nuevo vino
    const responseVino = await Vino.create({
      nombre: "Malbec",
      descripcion: "Vino tinto de alta calidad",
      varietal: ["Malbec"],
      origen: "Argentina",
    });

    //agregando un curso
    const response = await Vino.create({
      nombre: "Cabernet Sauvignon",
      descripcion: "Vino tinto de alta calidad, originario de Francia",
      varietal: ["Cabernet Sauvignon"],
      origen: "Francia",
    });
    
    //agregando el id del varietal en un vino
    const indexacionId = "67b50ffb5a3147534033f460";
    const VinoId = "67b511c04bdcda37c52b7fa6";
    const responseIndexacion = await Indexacion.findByIdAndUpdate(
      indexacionId,
      { $push: { vino: { vino: VinoId } } },
      { new: true }
    );

    //obteniendo un producto mediante su _id
    const indexacion = await Indexacion.find();

    //guardamos un nuevo producto, con contraseña
    const nuevoProducto = new Indexacion({
      nombre: "Vino Malbec",
      varietal: "Malbec",
      descripcion: "Vino tinto de alta calidad, originario de Argentina",
      precio: 25.99,
    });

    await nuevoProducto.save();

    console.log(JSON.stringify(responseVino, null, 2));
  } catch (error) {
    console.log("Error al conectar con MongoDB");
  }
};

connectMongoDB();
