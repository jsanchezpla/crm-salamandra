/**
 * models/tenant/ticket.model.js
 *
 * Schema base para la colección `tickets` de cada tenant.
 * Incidencias con mensajes tipo chat embebidos.
 */

import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema(
  {
    number: { type: Number, index: true }, // autoincremental por tenant
    subject: { type: String, required: true, trim: true },

    // Origen
    clientId: { type: mongoose.Schema.Types.ObjectId, index: true },
    contactId: { type: mongoose.Schema.Types.ObjectId },
    reporterName: String,
    reporterEmail: String,
    channel: {
      type: String,
      enum: ["web", "email", "phone", "portal"],
      default: "web",
    },

    // Estado
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_client", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    category: String,
    tags: [String],

    // Asignación
    assignedTo: { type: mongoose.Schema.Types.ObjectId },
    team: String,

    // Mensajes tipo chat embebidos en el ticket
    messages: [
      {
        authorId: mongoose.Schema.Types.ObjectId,
        authorName: String,
        authorRole: { type: String, enum: ["agent", "client", "system"] },
        body: { type: String, required: true },
        attachments: [{ name: String, url: String }],
        isInternal: { type: Boolean, default: false }, // nota interna, no visible al cliente
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Tiempos
    firstResponseAt: Date,
    resolvedAt: Date,
    closedAt: Date,
    slaDeadline: Date,
  },
  { timestamps: true }
);

ticketSchema.index({ status: 1, priority: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ clientId: 1 });
