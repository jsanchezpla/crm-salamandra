/**
 * models/tenant/lead.model.js
 *
 * Schema base para la colección `leads` de cada tenant.
 * Oportunidades comerciales con stages y todos.
 */

import mongoose from "mongoose";

export const leadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // Vinculación (puede no existir aún como cliente)
    clientId: { type: mongoose.Schema.Types.ObjectId, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId },
    contactName: String,   // nombre libre si aún no es cliente
    contactEmail: { type: String, trim: true, lowercase: true },
    contactPhone: String,

    // Pipeline comercial
    stage: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"],
      default: "new",
    },
    value: { type: Number, default: 0 },      // importe estimado en €
    probability: { type: Number, default: 0, min: 0, max: 100 }, // %
    expectedCloseDate: Date,
    closedAt: Date,
    lostReason: String,

    // Gestión
    assignedTo: { type: mongoose.Schema.Types.ObjectId },
    source: String,   // "web", "referral", "cold_call", ...
    tags: [String],
    notes: String,

    // Actividades (referencia a tasks vinculadas)
    linkedTasks: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

leadSchema.index({ stage: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ clientId: 1 });
