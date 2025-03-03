import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const paginacionSchema = new mongoose.Schema({
  nombre: String,
  varietal: String,
  descripcion: String,
  origen: String,
  precio: Number,
  createdAt: { type: Date, default: Date.now },
  purchases: {
    type: Array,
    default: [],
  },
});

paginacionSchema.plugin(paginate);

const Paginacion = mongoose.model("Paginacion", paginacionSchema);

export default User;
