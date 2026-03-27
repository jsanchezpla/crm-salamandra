/**
 * lib/tenantSchema.js
 *
 * Construye el schema Mongoose de un módulo para un tenant concreto,
 * aplicando sus schemaExtensions sobre el schema base.
 *
 * Uso en buildTenantModels.js — no usar directamente en controladores.
 */

import { getBaseSchema } from "./baseSchemas.js";

// Mapa de tipos permitidos. Nunca usar eval() para esto.
const TYPE_MAP = {
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date,
};

/**
 * Devuelve un schema Mongoose listo para registrar como modelo,
 * con los campos extra del tenant ya añadidos.
 *
 * @param {string} collectionKey - Clave de colección (ej: "clients")
 * @param {object} tenantModuleConfig - Documento TenantModule del tenant
 * @returns {mongoose.Schema}
 */
export function buildTenantSchema(collectionKey, tenantModuleConfig) {
  const schema = getBaseSchema(collectionKey);

  if (tenantModuleConfig?.schemaExtensions?.length) {
    const extra = {};
    for (const ext of tenantModuleConfig.schemaExtensions) {
      const Type = TYPE_MAP[ext.type] ?? String;
      extra[ext.field] = {
        type: Type,
        required: ext.required ?? false,
        default: ext.defaultValue,
      };
    }
    schema.add(extra);
  }

  return schema;
}

// Mantener compatibilidad con el nombre anterior si alguien lo usaba
export { buildTenantSchema as buildClientSchema };
