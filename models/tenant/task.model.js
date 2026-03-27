/**
 * models/tenant/task.model.js
 *
 * Schema base para la colección `tasks` de cada tenant.
 * Tarjetas del Kanban con checklist, asignaciones y orden.
 */

import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    columnId: { type: String, required: true }, // id de la columna en project.columns
    order: { type: Number, default: 0 },        // posición dentro de la columna

    title: { type: String, required: true, trim: true },
    description: String,

    // Asignación
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId }],
    reporterId: { type: mongoose.Schema.Types.ObjectId },

    // Prioridad y fechas
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    dueDate: Date,
    completedAt: Date,

    // Checklist interna
    checklist: [
      {
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],

    // Etiquetas y referencias
    tags: [String],
    linkedLeadId: { type: mongoose.Schema.Types.ObjectId },
    linkedClientId: { type: mongoose.Schema.Types.ObjectId },

    // Archivos adjuntos (paths o URLs)
    attachments: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1, columnId: 1, order: 1 });
taskSchema.index({ assignedTo: 1 });
