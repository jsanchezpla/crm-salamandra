import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    cursoInteres: { type: String, required: true },
    estado: {
      type: String,
      enum: ["Nuevo", "Contactado", "Convertido a Alumno", "Descartado"],
      default: "Nuevo",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
