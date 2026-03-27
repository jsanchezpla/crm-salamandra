/**
 * models/tenant/team_member.model.js
 *
 * Schema base para la colección `team_members` de cada tenant.
 * Perfil extendido del usuario dentro de este tenant (RRHH, roles, etc.)
 * Referencia al userId de master_db.
 */

import mongoose from "mongoose";

export const teamMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    avatar: String,

    // Cargo y departamento
    jobTitle: String,
    department: String,
    reportsTo: { type: mongoose.Schema.Types.ObjectId }, // otro teamMember

    // Datos de RRHH
    startDate: Date,
    endDate: Date,
    contractType: {
      type: String,
      enum: ["full_time", "part_time", "freelance", "intern"],
      default: "full_time",
    },
    workHoursPerWeek: { type: Number, default: 40 },

    // Acceso al CRM
    role: {
      type: String,
      enum: ["admin", "manager", "agent", "viewer"],
      default: "agent",
    },
    moduleAccess: [String],
    active: { type: Boolean, default: true },
    lastLogin: Date,

    // Skills / certificaciones
    skills: [String],
    certifications: [
      {
        name: String,
        issuedAt: Date,
        expiresAt: Date,
        url: String,
      },
    ],

    notes: String,
  },
  { timestamps: true }
);

teamMemberSchema.index({ userId: 1 });
teamMemberSchema.index({ department: 1 });
