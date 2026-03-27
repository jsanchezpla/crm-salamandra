/**
 * GET /api/admin/repair
 *
 * 1. Comprueba el tenant "demo" en master_db y corrige dbName si es "test"
 * 2. Lista las colecciones de la BD "test" que no son de sistema
 *
 * GET /api/admin/repair?drop=true
 *
 * Además borra esas colecciones de "test"
 *
 * ⚠️  Solo para desarrollo. Eliminar antes de producción.
 */
import { NextResponse } from "next/server";
import { getMasterModels, getMasterDb } from "@/lib/masterDb";
import { getTenantConnection } from "@/lib/tenantConnections";

const DEMO_SLUG = process.env.DEV_TENANT_SLUG || "demo";
const CORRECT_DB = `crm_${DEMO_SLUG}`;
const SYSTEM_COLLECTIONS = new Set(["system.views", "system.users", "system.profile"]);

export async function GET(request) {
  const drop = new URL(request.url).searchParams.get("drop") === "true";

  try {
    // ── 1. Verificar y corregir tenant.dbName ────────────────────────────────
    const { Tenant } = await getMasterModels();
    const tenant = await Tenant.findOne({ slug: DEMO_SLUG });

    if (!tenant) {
      return NextResponse.json({ error: `Tenant "${DEMO_SLUG}" no encontrado en master_db` }, { status: 404 });
    }

    const originalDbName = tenant.dbName;
    let fixed = false;

    if (tenant.dbName !== CORRECT_DB) {
      await Tenant.updateOne({ _id: tenant._id }, { $set: { dbName: CORRECT_DB } });
      fixed = true;
    }

    // ── 2. Inspeccionar la BD "test" ─────────────────────────────────────────
    const masterDb = await getMasterDb();
    const baseUri = process.env.MONGODB_URI || process.env.MONGODB_MASTER_URI;
    const [uriBase, ...qParts] = baseUri.split("?");
    const query = qParts.length ? "?" + qParts.join("?") : "";
    const protocolEnd = uriBase.indexOf("//") + 2;
    const pathStart = uriBase.indexOf("/", protocolEnd);
    const host = pathStart === -1 ? uriBase : uriBase.slice(0, pathStart);
    const testUri = `${host}/test${query}`;

    const testConn = await masterDb.useDb("test", { useCache: true });
    const testCollections = await testConn.db.listCollections().toArray();
    const toDrop = testCollections
      .map((c) => c.name)
      .filter((n) => !SYSTEM_COLLECTIONS.has(n));

    let dropped = [];
    if (drop && toDrop.length > 0) {
      for (const col of toDrop) {
        await testConn.db.dropCollection(col);
        dropped.push(col);
      }
    }

    // ── 3. Confirmar que crm_demo es accesible ────────────────────────────────
    const tenantDb = await getTenantConnection(CORRECT_DB);
    const tenantCollections = await tenantDb.db.listCollections().toArray();

    return NextResponse.json({
      tenant: {
        slug: DEMO_SLUG,
        dbName_antes: originalDbName,
        dbName_ahora: fixed ? CORRECT_DB : originalDbName,
        corregido: fixed,
      },
      test_db: {
        colecciones_encontradas: toDrop,
        colecciones_borradas: dropped,
        accion: drop ? "DROP ejecutado" : "Pasa ?drop=true para borrarlas",
      },
      crm_demo: {
        accesible: true,
        colecciones: tenantCollections.map((c) => c.name),
      },
    });
  } catch (error) {
    console.error("[repair] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
