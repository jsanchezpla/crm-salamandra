/**
 * models/master/tenant_modules.model.js
 *
 * Definición de referencia del schema TenantModule (la pieza clave del motor
 * de personalización por tenant).
 * La implementación real (con modelo registrado) vive en lib/masterDb.js.
 * Usa getMasterModels() para obtener el modelo: { TenantModule } = await getMasterModels()
 */

import mongoose from "mongoose";

export const tenantModuleSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    moduleKey: {
      type: String,
      required: true,
      enum: [
        "clients",
        "sales",
        "projects",
        "support",
        "billing",
        "team",
        "planning",
        "documents",
        "inventory",
        "training",
        "automations",
        "ai",
        "integrations",
        "analytics",
        "communications",
        "client_portal",
      ],
    },
    enabled: { type: Boolean, default: true },

    // Control de versiones — decide qué cliente recibe cada update
    version: { type: String, default: "base" }, // 'base' | 'v2' | 'custom'

    // Campos extra que solo tiene este cliente en este módulo
    schemaExtensions: [
      {
        field: { type: String, required: true },           // "num_expediente"
        type: {
          type: String,
          enum: ["String", "Number", "Boolean", "Date"],
          default: "String",
        },
        required: { type: Boolean, default: false },
        defaultValue: mongoose.Schema.Types.Mixed,
        label: String,    // etiqueta en UI: "Nº Expediente"
        section: String,  // dónde aparece en el formulario
      },
    ],

    // Flags que cambian el comportamiento de la lógica
    logicOverrides: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      // Ej: { "requireApproval": true, "maxTicketsPerDay": 50 }
    },

    // Componente React distinto para este cliente
    uiOverride: {
      componentPath: String,             // "clients/AcmeClientsModule"
      configJson: mongoose.Schema.Types.Mixed,
    },

    // Control de despliegue gradual
    featureFlags: [
      {
        key: { type: String, required: true },   // "new_kanban_ui"
        enabled: { type: Boolean, default: false },
        rolloutPct: { type: Number, default: 100, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

tenantModuleSchema.index({ tenantId: 1, moduleKey: 1 }, { unique: true });
