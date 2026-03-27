/**
 * models/tenant/notification.model.js
 *
 * Schema base para la colección `notifications` de cada tenant.
 * Sistema de notificaciones unificado por canal.
 */

import mongoose from "mongoose";

export const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Tipo y contenido
    type: {
      type: String,
      required: true,
      // Ejemplos: "ticket.assigned", "lead.won", "task.due", "mention"
    },
    title: { type: String, required: true },
    body: String,
    icon: String,

    // Referencia a la entidad que generó la notificación
    entityType: String,   // "ticket" | "lead" | "task" | ...
    entityId: mongoose.Schema.Types.ObjectId,
    entityUrl: String,    // ruta relativa en el frontend

    // Canales de entrega
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },

    // Estado
    read: { type: Boolean, default: false },
    readAt: Date,
    sentAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
