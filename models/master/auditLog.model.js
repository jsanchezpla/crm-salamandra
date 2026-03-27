/**
 * models/master/auditLog.model.js
 *
 * Definición de referencia del schema AuditLog.
 * La implementación real (con modelo registrado) vive en lib/masterDb.js.
 * Usa getMasterModels() para obtener el modelo: { AuditLog } = await getMasterModels()
 */

import mongoose from "mongoose";

export const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    action: { type: String, required: true }, // "module.updated", "feature.toggled"
    moduleKey: String,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

auditLogSchema.index({ tenantId: 1, createdAt: -1 });
