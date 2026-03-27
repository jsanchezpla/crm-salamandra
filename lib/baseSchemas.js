/**
 * lib/baseSchemas.js
 *
 * Devuelve un CLONE del schema base de cada colección tenant.
 * Siempre retorna un clone para que cada tenant pueda añadir
 * sus schemaExtensions sin contaminar el schema original.
 *
 * Uso en buildTenantModels.js:
 *   const schema = getBaseSchema('clients');
 */

import { clientSchema } from "../models/tenant/client.model.js";
import { contactSchema } from "../models/tenant/contact.model.js";
import { leadSchema } from "../models/tenant/lead.model.js";
import { projectSchema } from "../models/tenant/project.model.js";
import { taskSchema } from "../models/tenant/task.model.js";
import { ticketSchema } from "../models/tenant/ticket.model.js";
import { invoiceSchema } from "../models/tenant/invoice.model.js";
import { teamMemberSchema } from "../models/tenant/team_member.model.js";
import { assetSchema } from "../models/tenant/asset.model.js";
import { trainingSchema } from "../models/tenant/training.model.js";
import { notificationSchema } from "../models/tenant/notification.model.js";
import { messageSchema } from "../models/tenant/message.model.js";

const BASE_SCHEMAS = {
  clients: clientSchema,
  contacts: contactSchema,
  leads: leadSchema,
  projects: projectSchema,
  tasks: taskSchema,
  tickets: ticketSchema,
  invoices: invoiceSchema,
  team_members: teamMemberSchema,
  assets: assetSchema,
  trainings: trainingSchema,
  notifications: notificationSchema,
  messages: messageSchema,
};

/**
 * Devuelve un clon del schema base para la colección indicada.
 * @param {string} collectionKey - Clave de colección (ej: "clients")
 * @returns {mongoose.Schema}
 */
export function getBaseSchema(collectionKey) {
  const schema = BASE_SCHEMAS[collectionKey];
  if (!schema) {
    throw new Error(`[baseSchemas] Schema "${collectionKey}" no existe`);
  }
  return schema.clone();
}
