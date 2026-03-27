import mongoose from "mongoose";

/**
 * Pool de conexiones por tenant.
 * Cada tenant tiene su propia conexión a MongoDB, reutilizada entre requests.
 * Sin esto: cada request abre y cierra una conexión → rendimiento pésimo.
 */

const connectionPool = new Map(); // slug → mongoose.Connection

/** Reemplaza (o inserta) el nombre de BD en una URI de MongoDB. */
function injectDbName(uri, dbName) {
  const [base, ...queryParts] = uri.split("?");
  const query = queryParts.length ? "?" + queryParts.join("?") : "";
  const protocolEnd = base.indexOf("//") + 2;
  const pathStart = base.indexOf("/", protocolEnd);
  const host = pathStart === -1 ? base : base.slice(0, pathStart);
  return `${host}/${dbName}${query}`;
}
const CONNECTION_TIMEOUT = 30_000; // 30s para conectar
const MAX_POOL_SIZE = 10; // conexiones simultáneas por tenant
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 min → cerrar conexiones inactivas

// Rastrear último uso para cerrar conexiones idle
const lastUsed = new Map();

/**
 * Devuelve (o crea) la conexión Mongoose para un tenant concreto.
 * @param {string} dbName  — ej: "crm_acme"
 * @returns {mongoose.Connection}
 */
export async function getTenantConnection(dbName) {
  if (!dbName) throw new Error("getTenantConnection: dbName es obligatorio");

  // Reutilizar conexión existente si está activa
  if (connectionPool.has(dbName)) {
    const conn = connectionPool.get(dbName);

    // Reconectar si se cayó
    if (conn.readyState === 0 /* disconnected */) {
      connectionPool.delete(dbName);
      lastUsed.delete(dbName);
    } else {
      lastUsed.set(dbName, Date.now());
      return conn;
    }
  }

  // Construir URI — la BD del tenant cuelga del mismo cluster que master_db
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("MONGODB_URI no está definida en .env");

  const uri = injectDbName(baseUri, dbName);

  console.log(`[TenantDB] Abriendo conexión → ${dbName}`);

  const conn = await mongoose
    .createConnection(uri, {
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      maxPoolSize: MAX_POOL_SIZE,
      minPoolSize: 1,
      socketTimeoutMS: 45_000,
    })
    .asPromise();

  conn.on("error", (err) => {
    console.error(`[TenantDB] Error en ${dbName}:`, err.message);
    connectionPool.delete(dbName);
    lastUsed.delete(dbName);
  });

  conn.on("disconnected", () => {
    console.warn(`[TenantDB] Desconectado de ${dbName}`);
    connectionPool.delete(dbName);
    lastUsed.delete(dbName);
  });

  connectionPool.set(dbName, conn);
  lastUsed.set(dbName, Date.now());

  return conn;
}

/**
 * Cierra la conexión de un tenant concreto.
 * Útil cuando desactivas un tenant desde el panel de admin.
 */
export async function closeTenantConnection(dbName) {
  const conn = connectionPool.get(dbName);
  if (!conn) return;

  await conn.close();
  connectionPool.delete(dbName);
  lastUsed.delete(dbName);
  console.log(`[TenantDB] Conexión cerrada → ${dbName}`);
}

/**
 * Cierra TODAS las conexiones del pool.
 * Llamar en el shutdown del servidor (SIGTERM / SIGINT).
 */
export async function closeAllConnections() {
  const names = [...connectionPool.keys()];
  await Promise.all(names.map(closeTenantConnection));
  console.log(`[TenantDB] Pool vaciado (${names.length} conexiones cerradas)`);
}

/**
 * Limpia conexiones que llevan más de IDLE_TIMEOUT_MS sin usarse.
 * Se ejecuta cada 5 minutos via setInterval.
 */
function purgeIdleConnections() {
  const now = Date.now();
  for (const [dbName, ts] of lastUsed.entries()) {
    if (now - ts > IDLE_TIMEOUT_MS) {
      console.log(`[TenantDB] Cerrando conexión idle → ${dbName}`);
      closeTenantConnection(dbName);
    }
  }
}

// Arrancar el purge automático (no bloquea el event loop)
const purgeInterval = setInterval(purgeIdleConnections, 5 * 60 * 1000);
purgeInterval.unref(); // no impide que el proceso cierre

// Graceful shutdown
process.on("SIGTERM", closeAllConnections);
process.on("SIGINT", closeAllConnections);

/**
 * Info de diagnóstico — útil en un endpoint /admin/health
 */
export function getPoolStats() {
  return {
    openConnections: connectionPool.size,
    tenants: [...connectionPool.entries()].map(([dbName, conn]) => ({
      dbName,
      readyState:
        ["disconnected", "connected", "connecting", "disconnecting"][conn.readyState] ??
        conn.readyState,
      lastUsed: new Date(lastUsed.get(dbName)).toISOString(),
    })),
  };
}
