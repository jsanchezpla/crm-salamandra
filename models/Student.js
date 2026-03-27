import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema(
  {
    // Datos de cuenta
    username: { type: String },
    email: { type: String, required: true, unique: true },
    activo: { type: Boolean, default: true },

    // Datos personales
    nombre: { type: String },
    apellidos: { type: String },
    telefono: { type: String, default: "No proporcionado" }, // Opcional

    // Datos de facturación / envío
    direccion: { type: String },
    codigoPostal: { type: String },
    ciudad: { type: String },

    // Perfil profesional
    tipoPerfil: {
      type: String,
      enum: ["Privado", "Empresa"],
      default: "Privado",
    },
    esProfesional: { type: Boolean, default: false },
    profesion: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
