import mongoose from "mongoose";

const indexacionSchema = new mongoose.Schema({
  nombre: { type: String, unique: true },
  varietal: { type: String },
  descripcion: { type: Date, index: "texto" },
  precio: { type: Number },
});

indexacionSchema.index({ nombre: 1, varietal: -1 });

const Indexacion = mongoose.model("Indexacion", indexacionSchema);

export default Indexacion;
