/**
 * models/tenant/client.model.js
 *
 * Schema base para la colección `clients` de cada tenant.
 * NO exporta un modelo — los modelos se crean en lib/buildTenantModels.js
 * sobre la conexión específica del tenant (req.tenantDb).
 */

import mongoose from "mongoose";

export const clientSchema = new mongoose.Schema(
  {
    // Identificación
    type: {
      type: String,
      enum: ["individual", "company"],
      default: "company",
    },
    name: { type: String, required: true, trim: true },
    taxId: { type: String, trim: true },   // NIF/CIF

    // Contacto principal
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    website: String,

    // Dirección
    address: {
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: { type: String, default: "ES" },
    },

    // Relación comercial
    status: {
      type: String,
      enum: ["prospect", "active", "inactive", "blocked"],
      default: "prospect",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId }, // userId del agente
    tags: [String],
    notes: String,

    // Portal del cliente (módulo client_portal)
    portalAccess: {
      enabled: { type: Boolean, default: false },
      email: String,
      passwordHash: String,
      lastLogin: Date,
    },
  },
  { timestamps: true }
);

clientSchema.index({ name: "text", email: "text" });
clientSchema.index({ status: 1 });
clientSchema.index({ assignedTo: 1 });
