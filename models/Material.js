import mongoose from "mongoose";

export const MaterialSchema = new mongoose.Schema(
  {
    // Conectamos este material con un Alumno de la base de datos
    alumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    nombreMaterial: { type: String, required: true },

    // La fecha exacta en la que lo compró (se pone sola al crearse)
    fechaCompra: { type: Date, default: Date.now },

    categoria: { type: String, required: true },

    // Opcional: Podrías añadir el precio por si quieres ver cuánto has facturado
    precio: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Material || mongoose.model("Material", MaterialSchema);
