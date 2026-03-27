/**
 * models/tenant/asset.model.js
 *
 * Schema base para la colección `assets` de cada tenant.
 * Inventario: equipos, licencias, materiales.
 */

import mongoose from "mongoose";

export const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },   // código interno / número de serie

    category: {
      type: String,
      enum: ["hardware", "software", "license", "vehicle", "furniture", "other"],
      default: "other",
    },

    // Estado físico / lógico
    status: {
      type: String,
      enum: ["available", "in_use", "maintenance", "retired", "lost"],
      default: "available",
    },

    // Asignación actual
    assignedTo: { type: mongoose.Schema.Types.ObjectId }, // teamMember
    assignedAt: Date,
    location: String,

    // Datos económicos
    purchaseDate: Date,
    purchasePrice: Number,
    supplier: String,
    warrantyExpiry: Date,

    // Licencias de software
    licenseKey: String,
    licenseExpiry: Date,
    licenseSeats: Number,

    notes: String,
    tags: [String],
  },
  { timestamps: true }
);

assetSchema.index({ status: 1 });
assetSchema.index({ assignedTo: 1 });
assetSchema.index({ category: 1 });
