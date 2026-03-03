import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    // Datos de cuenta
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    activo: { type: Boolean, default: true },

    // Datos personales
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
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
