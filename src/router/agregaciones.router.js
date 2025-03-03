import mongoose from "mongoose";
import Vinoteca from "../models/agregaciones.model";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conectado correctamente a MongoDB!");

    const response = await Vinoteca.aggregate([
      //1️⃣ Buscar dentro del campo de "varietal" (buqueda de texto)
      { $match: { $text: { $search: "varietal" } } },

      //2️⃣ Filtrar vinos con precio mayor de 10000
      { $match: { precio: { $gt: 10000 } } },

      //3️⃣ Transformamos los datos con una proyeccion
      { $project: { nombre: 1, varietal: 1, origen: 1, precio: 1 } },

      //4️⃣ Agrupamos por ciudad
      {
        $group: {
          _id: "$origen",
          totalVinoteca: { $sum: 1 },
          avgPrecio: { $avg: "$precio" },
        },
      },

      //5️⃣ Ordenamos por cantidad de vinos en la ciudad (de mayor a menor)
      { $sort: { totalVinoteca: -1 } },

      //6️⃣ Limitamos los resultados
      { $limit: 3 },

      //7️⃣ Salteamos el primer documento
      { $skip: 1 },
    ]);

    console.log(response);
  } catch (error) {
    console.log("Error al conectar con MongoDB: ", error.message);
  }
};

connectMongoDB();
