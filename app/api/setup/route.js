/**
 * GET /api/setup
 * GET /api/setup?slug=demo2&name=Demo+2&email=admin@demo2.com&pass=Secret123
 *
 * Crea un tenant + superadmin en master_db.
 * Sin parámetros usa los valores de .env.local / defaults.
 *
 * ⚠️  Proteger o eliminar este endpoint antes de ir a producción.
 */
import { NextResponse } from "next/server";
import { getMasterModels } from "@/lib/masterDb";
import bcrypt from "bcryptjs";

const DEFAULT_MODULES = ["clients", "sales", "projects", "support", "billing", "team"];

export async function GET(request) {
  const params  = new URL(request.url).searchParams;
  const slug    = params.get("slug")  || process.env.DEV_TENANT_SLUG || "demo";
  const name    = params.get("name")  || slug.charAt(0).toUpperCase() + slug.slice(1);
  const email   = params.get("email") || process.env.SETUP_ADMIN_EMAIL || "jsanchezpla@gmail.com";
  const pass    = params.get("pass")  || process.env.SETUP_ADMIN_PASS  || "Aumenta2026*";

  try {
    const { Tenant, User, TenantModule } = await getMasterModels();

    // ── 1. Tenant ─────────────────────────────────────────────────────────────
    let tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      tenant = await Tenant.create({
        name,
        slug,
        dbName: `crm_${slug}`,
        plan: "pro",
        active: true,
      });

      await TenantModule.insertMany(
        DEFAULT_MODULES.map((moduleKey) => ({
          tenantId: tenant._id,
          moduleKey,
          enabled: true,
          version: "base",
        }))
      );
    }

    // ── 2. Usuario admin del tenant ───────────────────────────────────────────
    const salt         = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(pass, salt);

    const userExists = await User.findOne({ email });
    if (userExists) {
      // Migrar password → passwordHash si el usuario es del esquema antiguo
      if (!userExists.passwordHash) {
        await User.updateOne(
          { _id: userExists._id },
          { $set: { passwordHash }, $unset: { password: "" } }
        );
      }
      return NextResponse.json({
        msg:        "Tenant ya existía — usuario actualizado si era necesario",
        tenant:     tenant.slug,
        dbName:     tenant.dbName,
        adminEmail: email,
        migrated:   !userExists.passwordHash,
      });
    }

    await User.create({
      tenantId:     tenant._id,
      name:         `Admin ${name}`,
      email,
      passwordHash,
      role:         "superadmin",
      moduleAccess: DEFAULT_MODULES,
      active:       true,
    });

    return NextResponse.json({
      success:    true,
      message:    "Setup completado",
      tenant:     tenant.slug,
      dbName:     tenant.dbName,
      adminEmail: email,
    });
  } catch (error) {
    console.error("Error en setup:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
