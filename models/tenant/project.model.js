/**
 * models/tenant/project.model.js
 *
 * Schema base para la colección `projects` de cada tenant.
 * Proyectos con columnas Kanban personalizables.
 */

import mongoose from "mongoose";

export const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    clientId: { type: mongoose.Schema.Types.ObjectId, index: true },

    // Estado del proyecto
    status: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "cancelled"],
      default: "planning",
    },

    // Columnas del Kanban (ordenadas por order)
    columns: [
      {
        id: { type: String, required: true },     // uuid o slug
        name: { type: String, required: true },   // "En progreso"
        order: { type: Number, default: 0 },
        color: String,
        isDefault: { type: Boolean, default: false },
        isDone: { type: Boolean, default: false }, // marca columna como "hecho"
      },
    ],

    // Fechas
    startDate: Date,
    dueDate: Date,
    completedAt: Date,

    // Equipo
    ownerId: { type: mongoose.Schema.Types.ObjectId },
    members: [{ type: mongoose.Schema.Types.ObjectId }],

    tags: [String],
    notes: String,
  },
  { timestamps: true }
);

projectSchema.index({ status: 1 });
projectSchema.index({ clientId: 1 });
