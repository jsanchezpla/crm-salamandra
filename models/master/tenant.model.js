/**
 * models/master/tenant.model.js
 *
 * Definición de referencia del schema Tenant.
 * La implementación real (con modelo registrado) vive en lib/masterDb.js.
 * Usa getMasterModels() para obtener el modelo: { Tenant } = await getMasterModels()
 */

import mongoose from "mongoose";

export const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // "acme"
    dbName: { type: String, required: true, unique: true }, // "crm_acme"
    plan: {
      type: String,
      enum: ["starter", "pro", "enterprise"],
      default: "pro",
    },
    active: { type: Boolean, default: true },
    settings: {
      primaryColor: String,
      logoUrl: String,
      timezone: { type: String, default: "Europe/Madrid" },
      currency: { type: String, default: "EUR" },
      language: { type: String, default: "es" },
    },
  },
  { timestamps: true }
);
