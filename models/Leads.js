import mongoose from "mongoose";

export const LeadSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, default: "No proporcionado" },
    tipo_usuario: {
      type: String,
      enum: ["ciudadano", "profesional"],
      default: "ciudadano",
    },
    motivo: {
      type: String,
      enum: ["diagnostico", "servicios", "cursos"],
      required: true,
    },
    servicio: { type: String },
    curso: { type: String },
    mensaje: { type: String },
    estado: {
      type: String,
      enum: ["Nuevo", "Contactado", "Descartado"],
      default: "Nuevo",
    },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
