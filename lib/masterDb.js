import mongoose from "mongoose";

/**
 * Conexión singleton a master_db.
 * Todos los modelos globales (Tenant, User, TenantModule, AuditLog)
 * viven aquí — nunca en las BDs de los tenants.
 */

let masterConnection = null;

/** Reemplaza (o inserta) el nombre de BD en una URI de MongoDB. */
function injectDbName(uri, dbName) {
  const [base, ...queryParts] = uri.split("?");
  const query = queryParts.length ? "?" + queryParts.join("?") : "";
  const protocolEnd = base.indexOf("//") + 2;
  const pathStart = base.indexOf("/", protocolEnd);
  const host = pathStart === -1 ? base : base.slice(0, pathStart);
  return `${host}/${dbName}${query}`;
}

export async function getMasterDb() {
  if (masterConnection && masterConnection.readyState === 1) {
    return masterConnection;
  }

  const uri = process.env.MONGODB_MASTER_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_MASTER_URI no está definida en .env");

  // Inyectar "master_db" en el path de la URI, antes del query string
  const masterUri = uri.includes("/master_db")
    ? uri
    : injectDbName(uri, "master_db");

  console.log("[MasterDB] Conectando a master_db...");

  masterConnection = await mongoose
    .createConnection(masterUri, {
      serverSelectionTimeoutMS: 30_000,
      maxPoolSize: 5,
    })
    .asPromise();

  masterConnection.on("error", (err) => {
    console.error("[MasterDB] Error:", err.message);
    masterConnection = null;
  });

  console.log("[MasterDB] Conectado");
  return masterConnection;
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    dbName: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["starter", "pro", "enterprise"], default: "pro" },
    active: { type: Boolean, default: true },
    settings: {
      primaryColor: String,
      logoUrl: String,
      timezone: { type: String, default: "Europe/Madrid" },
      currency: { type: String, default: "EUR" },
      language: { type: String, default: "es" },
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager", "agent", "viewer"],
      default: "agent",
    },
    moduleAccess: [String],
    active: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

const TenantModuleSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
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
    version: { type: String, default: "base" },

    schemaExtensions: [
      {
        field: { type: String, required: true },
        type: { type: String, enum: ["String", "Number", "Boolean", "Date"], default: "String" },
        required: { type: Boolean, default: false },
        defaultValue: mongoose.Schema.Types.Mixed,
        label: String,
        section: String,
      },
    ],

    logicOverrides: { type: Map, of: mongoose.Schema.Types.Mixed },

    uiOverride: {
      componentPath: String,
      configJson: mongoose.Schema.Types.Mixed,
    },

    featureFlags: [
      {
        key: { type: String, required: true },
        enabled: { type: Boolean, default: false },
        rolloutPct: { type: Number, default: 100, min: 0, max: 100 },
      },
    ],
  },
  { timestamps: true }
);

TenantModuleSchema.index({ tenantId: 1, moduleKey: 1 }, { unique: true });

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    action: { type: String, required: true },
    moduleKey: String,
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

AuditLogSchema.index({ tenantId: 1, createdAt: -1 });

// ─── Modelos (registrados sobre la conexión master, no en mongoose global) ───

const modelCache = new Map();

export async function getMasterModels() {
  const conn = await getMasterDb();

  if (!modelCache.has("Tenant")) {
    modelCache.set("Tenant", conn.model("Tenant", TenantSchema));
    modelCache.set("User", conn.model("User", UserSchema));
    modelCache.set("TenantModule", conn.model("TenantModule", TenantModuleSchema));
    modelCache.set("AuditLog", conn.model("AuditLog", AuditLogSchema));
  }

  return {
    Tenant: modelCache.get("Tenant"),
    User: modelCache.get("User"),
    TenantModule: modelCache.get("TenantModule"),
    AuditLog: modelCache.get("AuditLog"),
  };
}
