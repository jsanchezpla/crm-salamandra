/**
 * lib/buildTenantModels.js
 *
 * Construye y cachea los modelos Mongoose del tenant sobre su conexión propia.
 * Aplica los schemaExtensions de cada módulo antes de registrar el modelo.
 *
 * Uso en controladores:
 *   const { Client, Lead } = buildTenantModels(req.tenantDb, req.tenantModules);
 *   const clients = await Client.find();
 */

import { buildTenantSchema } from "./tenantSchema.js";

// Mapa colección → moduleKey que contiene sus schemaExtensions
const COLLECTION_MODULE_MAP = {
  clients: "clients",
  contacts: "clients",   // los contactos viven bajo el módulo clients
  leads: "sales",
  projects: "projects",
  tasks: "projects",
  tickets: "support",
  invoices: "billing",
  team_members: "team",
  assets: "inventory",
  trainings: "training",
  notifications: "communications",
  messages: "communications",
};

// Nombre del modelo Mongoose por colección
const MODEL_NAMES = {
  clients: "Client",
  contacts: "Contact",
  leads: "Lead",
  projects: "Project",
  tasks: "Task",
  tickets: "Ticket",
  invoices: "Invoice",
  team_members: "TeamMember",
  assets: "Asset",
  trainings: "Training",
  notifications: "Notification",
  messages: "Message",
};

// Caché: connectionId → { Client, Lead, ... }
const modelCache = new Map();

/**
 * Construye (o devuelve de caché) todos los modelos Mongoose del tenant.
 *
 * @param {mongoose.Connection} tenantDb - req.tenantDb
 * @param {object} tenantModules - req.tenantModules (Map moduleKey → TenantModule doc)
 * @returns {{ Client, Contact, Lead, Project, Task, Ticket, Invoice, TeamMember, Asset, Training, Notification, Message }}
 */
export function buildTenantModels(tenantDb, tenantModules) {
  const connId = tenantDb.id;

  if (modelCache.has(connId)) {
    return modelCache.get(connId);
  }

  const models = {};

  for (const [collectionKey, modelName] of Object.entries(MODEL_NAMES)) {
    const moduleKey = COLLECTION_MODULE_MAP[collectionKey];
    const moduleConfig = tenantModules?.[moduleKey];

    // Si el módulo no está activo para este tenant, el modelo se registra
    // igualmente (puede haber rutas internas que lo necesiten), pero los
    // controladores deben comprobar hasModule() antes de exponerlo.
    const schema = buildTenantSchema(collectionKey, moduleConfig);

    // Evitar re-registrar si la conexión ya tiene el modelo (hot-reload dev)
    models[modelName] =
      tenantDb.models[modelName] ?? tenantDb.model(modelName, schema);
  }

  modelCache.set(connId, models);
  return models;
}

/**
 * Limpia la caché de modelos para una conexión concreta.
 * Llamar si la conexión se cierra o el tenant se reconfigura.
 *
 * @param {string} connId - tenantDb.id
 */
export function evictModelCache(connId) {
  modelCache.delete(connId);
}
