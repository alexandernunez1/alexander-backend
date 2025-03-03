import mongoose from "mongoose";
import Paginacion from "./models/paginacion.model.js";


const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conectado correctamente a MongoDB!");

    const response = await Paginacion.paginate(
      { origen: "Mendoza" },
      { limit: 10, page: 1 }
    );
    console.log(response);
  } catch (error) {
    console.log("Error al conectar con MongoDB!");
  }
};

connectMongoDB();
