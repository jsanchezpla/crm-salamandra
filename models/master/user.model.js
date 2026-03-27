/**
 * models/master/user.model.js
 *
 * Definición de referencia del schema User (equipo de Salamandra).
 * La implementación real (con modelo registrado) vive en lib/masterDb.js.
 * Usa getMasterModels() para obtener el modelo: { User } = await getMasterModels()
 */

import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager", "agent", "viewer"],
      default: "agent",
    },
    moduleAccess: [String], // ['clients', 'projects'] — qué módulos puede ver
    active: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);
