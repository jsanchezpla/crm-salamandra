/**
 * models/tenant/message.model.js
 *
 * Schema base para la colección `messages` de cada tenant.
 * Chat interno del equipo por canal (tipo Slack).
 */

import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    // Canal: puede ser un id de canal global, un proyecto, un ticket, etc.
    channelType: {
      type: String,
      enum: ["general", "project", "ticket", "direct"],
      required: true,
    },
    channelId: { type: String, required: true, index: true },
    // Para canales "direct" se guarda el par de userIds ordenado
    participants: [mongoose.Schema.Types.ObjectId],

    // Contenido
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    authorName: String,
    body: { type: String, required: true },
    attachments: [
      {
        name: String,
        url: String,
        type: String,  // "image" | "file" | "link"
      },
    ],

    // Hilo (respuesta a otro mensaje)
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    threadCount: { type: Number, default: 0 },

    // Reacciones
    reactions: [
      {
        emoji: String,
        userIds: [mongoose.Schema.Types.ObjectId],
      },
    ],

    editedAt: Date,
    deletedAt: Date,   // soft delete — no borrar de BD
  },
  { timestamps: true }
);

messageSchema.index({ channelId: 1, createdAt: 1 });
messageSchema.index({ authorId: 1 });
