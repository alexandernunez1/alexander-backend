import mongoose from "mongoose";
import bcrypt from "bcrypt"

const vinoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  varietal: {
    type: Array,
    default: []
  },
  origen: String
})

//middleware .pre()
vinoSchema.pre("find", function(next){
  this.populate("varietal");
  next();
});

vinoSchema.pre("save", async function(next){
  if(!this.isModified("nombre") ) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.nombre = await bcrypt.hash(this.nombre, salt);
    next();
  } catch (error) {
    next(error);
  }
});


const Vino = mongoose.model("Vino", vinoSchema);

export default Vino;
