import { getMasterModels } from "./masterDb.js";
import { getTenantConnection } from "./tenantConnections.js";

/**
 * Caché en memoria para la config de tenant.
 * Evita ir a master_db en cada request.
 * TTL: 60s — si cambias la config de un tenant, tarda máximo 1 min en reflejarse.
 */
const tenantCache = new Map(); // slug → { tenant, modules, expiresAt }
const CACHE_TTL_MS = 60_000;

function getCached(slug) {
  const entry = tenantCache.get(slug);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    tenantCache.delete(slug);
    return null;
  }
  return entry;
}

function setCache(slug, tenant, modules) {
  tenantCache.set(slug, {
    tenant,
    modules,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Fuerza la invalidación de caché de un tenant concreto.
 * Llamar desde el endpoint de admin cuando guardas cambios en TenantModule.
 */
export function invalidateTenantCache(slug) {
  tenantCache.delete(slug);
  console.log(`[TenantResolver] Caché invalidada → ${slug}`);
}

// ─── Extraer slug del request ─────────────────────────────────────────────────

function extractSlug(req) {
  // 1. Header explícito (útil en desarrollo y en llamadas API)
  if (req.headers["x-tenant"]) return req.headers["x-tenant"];

  // 2. Subdominio: acme.tucrm.com → "acme"
  const host = req.hostname || req.headers.host || "";
  const subdomain = host.split(".")[0];
  if (subdomain && subdomain !== "www" && subdomain !== "api") return subdomain;

  // 3. Parámetro en JWT (si usas auth middleware antes)
  if (req.user?.tenantSlug) return req.user.tenantSlug;

  return null;
}

// ─── Middleware principal ─────────────────────────────────────────────────────

/**
 * Express middleware.
 * Inyecta en req:
 *   req.tenant        — documento Tenant de master_db
 *   req.tenantModules — Map { moduleKey → TenantModule doc }
 *   req.tenantDb      — conexión Mongoose a la BD del tenant
 *
 * Uso en Express:
 *   app.use(resolveTenant)
 *
 * Uso selectivo (solo en rutas que lo necesiten):
 *   router.get('/clients', resolveTenant, clientsController.list)
 */
export async function resolveTenant(req, res, next) {
  try {
    const slug = extractSlug(req);
    if (!slug) {
      return res.status(400).json({ error: "No se pudo identificar el tenant" });
    }

    // ── 1. Leer de caché ──────────────────────────────────────────────────
    const cached = getCached(slug);
    if (cached) {
      req.tenant = cached.tenant;
      req.tenantModules = cached.modules;
      req.tenantDb = await getTenantConnection(cached.tenant.dbName);
      return next();
    }

    // ── 2. Leer de master_db ──────────────────────────────────────────────
    const { Tenant, TenantModule } = await getMasterModels();

    const tenant = await Tenant.findOne({ slug, active: true }).lean();
    if (!tenant) {
      return res.status(404).json({ error: `Tenant "${slug}" no encontrado o inactivo` });
    }

    const modulesDocs = await TenantModule.find({
      tenantId: tenant._id,
      enabled: true,
    }).lean();

    // Convertir array → Map para acceso O(1) en controladores
    const modulesMap = Object.fromEntries(modulesDocs.map((m) => [m.moduleKey, m]));

    // ── 3. Guardar en caché ───────────────────────────────────────────────
    setCache(slug, tenant, modulesMap);

    // ── 4. Conexión a BD del tenant ───────────────────────────────────────
    const tenantDb = await getTenantConnection(tenant.dbName);

    req.tenant = tenant;
    req.tenantModules = modulesMap;
    req.tenantDb = tenantDb;

    next();
  } catch (err) {
    console.error("[TenantResolver] Error:", err);
    next(err);
  }
}

// ─── Helper para controladores ────────────────────────────────────────────────

/**
 * Comprueba si un módulo está activo para el tenant del request.
 * Usar en controladores o en otros middlewares de ruta.
 *
 * Uso:
 *   if (!hasModule(req, 'billing')) return res.status(403).json(...)
 */
export function hasModule(req, moduleKey) {
  return Boolean(req.tenantModules?.[moduleKey]);
}

/**
 * Lee un logicOverride concreto del módulo activo.
 *
 * Uso:
 *   const maxTickets = getLogicOverride(req, 'support', 'maxTicketsPerDay') ?? 100
 */
export function getLogicOverride(req, moduleKey, key) {
  return req.tenantModules?.[moduleKey]?.logicOverrides?.get?.(key) ?? null;
}

/**
 * Comprueba si un feature flag está activo para este tenant.
 *
 * Uso:
 *   if (hasFeatureFlag(req, 'projects', 'new_kanban_ui')) { ... }
 */
export function hasFeatureFlag(req, moduleKey, flagKey) {
  const mod = req.tenantModules?.[moduleKey];
  if (!mod) return false;
  const flag = mod.featureFlags?.find((f) => f.key === flagKey);
  return flag?.enabled ?? false;
}
