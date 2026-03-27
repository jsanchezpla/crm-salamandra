import mongoose from "mongoose";

export const LeadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    cursos: {
      type: [String],
      required: true,
      default: [],
    },
    estado: {
      type: String,
      enum: ["Nuevo", "Contactado", "Descartado"],
      default: "Nuevo",
    },
    telefono: { type: String, default: "No proporcionado" },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
