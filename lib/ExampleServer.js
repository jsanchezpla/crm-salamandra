/**
 * Ejemplo de integración completa.
 * Este fichero NO es para producción — es para que veas cómo encajan
 * los tres módulos (masterDb, tenantConnections, tenantResolver).
 */

import express from "express";
import { getMasterModels } from "./lib/masterDb.js";
import { getPoolStats } from "./lib/tenantConnections.js";
import {
  resolveTenant,
  hasModule,
  getLogicOverride,
  hasFeatureFlag,
  invalidateTenantCache,
} from "./lib/tenantResolver.js";

const app = express();
app.use(express.json());

// ─── Rutas públicas (sin tenant) ─────────────────────────────────────────────

app.get("/health", async (req, res) => {
  res.json({
    status: "ok",
    pool: getPoolStats(),
  });
});

// ─── Rutas de tenant (con middleware) ────────────────────────────────────────

// El middleware resolveTenant se aplica a todas las rutas /api/v1
app.use("/api/v1", resolveTenant);

// Ejemplo: listar clientes del tenant
app.get("/api/v1/clients", async (req, res) => {
  // Comprobar que el módulo 'clients' está activo para este tenant
  if (!hasModule(req, "clients")) {
    return res.status(403).json({ error: "Módulo Clientes no disponible" });
  }

  // Aquí usarías req.tenantDb para obtener el modelo dinámico
  // const Client = req.tenantDb.model('Client', clientSchema)
  // const clients = await Client.find()

  // Leer un logicOverride del módulo (ej: límite de clientes)
  const maxClients = getLogicOverride(req, "clients", "maxClients") ?? Infinity;

  res.json({
    tenant: req.tenant.slug,
    module: req.tenantModules["clients"],
    maxClients,
    // clients,
  });
});

// Ejemplo: comprobar feature flag en proyectos
app.get("/api/v1/projects", async (req, res) => {
  if (!hasModule(req, "projects")) {
    return res.status(403).json({ error: "Módulo Proyectos no disponible" });
  }

  const useNewKanban = hasFeatureFlag(req, "projects", "new_kanban_ui");

  res.json({
    tenant: req.tenant.slug,
    kanbanVersion: useNewKanban ? "v2" : "base",
  });
});

// ─── Endpoint de admin: invalidar caché de un tenant ─────────────────────────
// Llamar después de modificar TenantModule desde el panel de admin

app.post("/admin/tenants/:slug/invalidate-cache", async (req, res) => {
  // TODO: añadir auth de superadmin aquí
  invalidateTenantCache(req.params.slug);
  res.json({ ok: true, message: `Caché de "${req.params.slug}" invalidada` });
});

// ─── Endpoint de admin: ver estado del pool ───────────────────────────────────

app.get("/admin/pool", (req, res) => {
  res.json(getPoolStats());
});

// ─── Ejemplo: crear un nuevo tenant desde el panel ───────────────────────────

app.post("/admin/tenants", async (req, res) => {
  const { name, slug, plan } = req.body;

  const { Tenant, TenantModule } = await getMasterModels();

  // 1. Crear tenant en master_db
  const tenant = await Tenant.create({
    name,
    slug,
    dbName: `crm_${slug}`,
    plan: plan ?? "pro",
  });

  // 2. Activar módulos base por defecto para todos los tenants nuevos
  const defaultModules = ["clients", "sales", "projects", "support", "billing", "team"];
  await TenantModule.insertMany(
    defaultModules.map((moduleKey) => ({
      tenantId: tenant._id,
      moduleKey,
      enabled: true,
      version: "base",
    }))
  );

  // 3. La BD crm_{slug} se crea automáticamente en MongoDB
  //    la primera vez que se escribe en ella — no hace falta crearla a mano

  res.status(201).json({ ok: true, tenant });
});

app.listen(3001, () => {
  console.log("Servidor arrancado en :3001");
});
