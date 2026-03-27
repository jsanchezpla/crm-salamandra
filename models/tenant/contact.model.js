/**
 * models/tenant/contact.model.js
 *
 * Schema base para la colección `contacts` de cada tenant.
 * Contactos por rol asociados a un cliente (empresa o individuo).
 */

import mongoose from "mongoose";

export const contactSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    role: String,   // "CEO", "Responsable compras", etc.
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    mobile: String,
    isPrimary: { type: Boolean, default: false },
    notes: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

contactSchema.index({ clientId: 1, isPrimary: 1 });
