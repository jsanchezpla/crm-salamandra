/**
 * models/tenant/training.model.js
 *
 * Schema base para la colección `trainings` de cada tenant.
 * Formaciones, cursos y certificados por usuario.
 */

import mongoose from "mongoose";

export const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,

    type: {
      type: String,
      enum: ["course", "workshop", "certification", "onboarding", "other"],
      default: "course",
    },

    // Contenido / estructura
    modules: [
      {
        title: { type: String, required: true },
        order: { type: Number, default: 0 },
        contentUrl: String,   // enlace a video, doc, etc.
        durationMin: Number,
      },
    ],

    // Fechas del curso
    startDate: Date,
    endDate: Date,
    durationHours: Number,

    // Instructor / proveedor
    instructor: String,
    provider: String,
    externalUrl: String,

    // Inscripciones y progreso
    enrollments: [
      {
        memberId: { type: mongoose.Schema.Types.ObjectId, required: true },
        enrolledAt: { type: Date, default: Date.now },
        completedAt: Date,
        progress: { type: Number, default: 0, min: 0, max: 100 }, // %
        passed: { type: Boolean, default: false },
        certificateUrl: String,
        score: Number,
      },
    ],

    tags: [String],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

trainingSchema.index({ type: 1 });
trainingSchema.index({ "enrollments.memberId": 1 });
