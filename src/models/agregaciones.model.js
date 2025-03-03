import mongoose from "mongoose";

const vinotecaSchema = new mongoose.Schema({
  nombre: String,
  varietal: String,
  descripcion: String,
  origen: String,
  precio: Number,
  createdAt: { type: Date, default: Date.now },
  purchases: {
    type: Array,
    default: []
  }
});

vinotecaSchema.index({ varietal: "text" });

const Vinoteca = mongoose.model("Vinoteca", vinotecaSchema);

export default Vinoteca;