/**
 * lib/withTenant.js
 *
 * Helper para Next.js App Router.
 * Equivalente a lib/tenantResolver.js pero para route handlers,
 * en lugar de Express middleware.
 *
 * Uso en cualquier route.js:
 *
 *   const ctx = await getTenantContext(request);
 *   if (ctx.error) return NextResponse.json({ error: ctx.error }, { status: ctx.status });
 *   const { tenantDb, tenantModules, tenant } = ctx;
 *
 *   // Registrar un modelo en la conexión del tenant:
 *   const Lead = getModel(tenantDb, 'Lead', LeadSchema);
 */

import { getMasterModels } from "./masterDb.js";
import { getTenantConnection } from "./tenantConnections.js";

// ─── Caché en memoria (idéntica a tenantResolver.js) ─────────────────────────

const tenantCache = new Map();
const CACHE_TTL_MS = 60_000;

function getCached(slug) {
  const entry = tenantCache.get(slug);
  if (!entry || Date.now() > entry.expiresAt) {
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

// ─── Extracción de slug ───────────────────────────────────────────────────────

function extractSlug(request) {
  // 1. Header explícito — el más fiable en desarrollo y en llamadas API
  const xTenant = request.headers.get("x-tenant");
  if (xTenant) return xTenant;

  // 2. Subdominio: acme.tucrm.com → "acme"
  const host = request.headers.get("host") || "";
  const subdomain = host.split(".")[0];
  const ignored = ["www", "localhost", "api"];
  // Ignorar dominios de plataformas de despliegue (netlify.app, vercel.app, etc.)
  const isPlatformDomain = host.endsWith(".netlify.app") || host.endsWith(".vercel.app");
  if (subdomain && !ignored.includes(subdomain) && !subdomain.includes(":") && !isPlatformDomain) {
    return subdomain;
  }

  // 3. Fallback para desarrollo local — define DEV_TENANT_SLUG en .env.local
  if (process.env.DEV_TENANT_SLUG) return process.env.DEV_TENANT_SLUG;

  return null;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Resuelve el contexto de tenant desde un NextRequest.
 * Devuelve { tenant, tenantModules, tenantDb } o { error, status }.
 *
 * @param {Request} request — request del route handler
 * @returns {Promise<{tenant, tenantModules, tenantDb} | {error: string, status: number}>}
 */
export async function getTenantContext(request) {
  try {
    const slug = extractSlug(request);
    if (!slug) {
      return { error: "No se pudo identificar el tenant", status: 400 };
    }

    // ── Caché ────────────────────────────────────────────────────────────
    const cached = getCached(slug);
    if (cached) {
      const tenantDb = await getTenantConnection(cached.tenant.dbName);
      return { tenant: cached.tenant, tenantModules: cached.modules, tenantDb };
    }

    // ── master_db ────────────────────────────────────────────────────────
    const { Tenant, TenantModule } = await getMasterModels();

    const tenant = await Tenant.findOne({ slug, active: true }).lean();
    if (!tenant) {
      return { error: `Tenant "${slug}" no encontrado o inactivo`, status: 404 };
    }

    const modulesDocs = await TenantModule.find({
      tenantId: tenant._id,
      enabled: true,
    }).lean();

    const tenantModules = Object.fromEntries(
      modulesDocs.map((m) => [m.moduleKey, m])
    );

    setCache(slug, tenant, tenantModules);

    const tenantDb = await getTenantConnection(tenant.dbName);
    return { tenant, tenantModules, tenantDb };
  } catch (err) {
    console.error("[withTenant] Error:", err);
    return { error: "Error resolviendo tenant", status: 500 };
  }
}

/**
 * Registra un modelo en la conexión del tenant.
 * Evita registrarlo dos veces si ya existe en la conexión.
 *
 * @param {mongoose.Connection} tenantDb
 * @param {string} modelName
 * @param {mongoose.Schema} schema
 * @returns {mongoose.Model}
 */
export function getModel(tenantDb, modelName, schema) {
  return tenantDb.models[modelName] ?? tenantDb.model(modelName, schema);
}

/**
 * Invalida la caché de este helper para un tenant concreto.
 * Llamar además de invalidateTenantCache() si usas ambos helpers.
 */
export function invalidateWithTenantCache(slug) {
  tenantCache.delete(slug);
}
