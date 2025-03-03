import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("conectado con MongoDB!!!");
  } catch (error) {
    console.error("error al conectar con MongoDB:", error.message);
    process.exit(1); //detiene toda la aplicación si detecta un error en la conexión
  }
};

export default connectMongoDB;
