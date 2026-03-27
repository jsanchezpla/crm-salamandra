import mongoose from "mongoose";

export const PurchaseSchema = new mongoose.Schema(
  {
    // Conectamos esta compra con un Alumno de la base de datos
    alumno: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    nombreCurso: { type: String, required: true },

    // La fecha exacta en la que lo compró (se pone sola al crearse)
    fechaCompra: { type: Date, default: Date.now },

    // Opcional: Podrías añadir el precio por si quieres ver cuánto has facturado
    precio: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
