import { NextResponse } from "next/server";
import { getTenantContext, getModel } from "@/lib/withTenant";
import { LeadSchema } from "@/models/Leads";
import { StudentSchema } from "@/models/Student";
import { PurchaseSchema } from "@/models/Purchase";
import { MaterialSchema } from "@/models/Material";

export async function GET(request) {
  try {
    const ctx = await getTenantContext(request);
    if (ctx.error) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status });
    }

    const { tenantDb } = ctx;

    // Registrar todos los modelos en la conexión del tenant
    // (Student debe registrarse antes de que Purchase pueda hacer populate)
    const Lead     = getModel(tenantDb, "Lead",     LeadSchema);
    const Student  = getModel(tenantDb, "Student",  StudentSchema);
    const Purchase = getModel(tenantDb, "Purchase", PurchaseSchema);
    const Material = getModel(tenantDb, "Material", MaterialSchema);

    const [leadsDB, alumnosDB, ventasDB, materialesDB] = await Promise.all([
      Lead.find({}).sort({ createdAt: -1 }).lean(),
      Student.find({}).sort({ createdAt: -1 }).lean(),
      Purchase.find({}).populate("alumno", "nombre apellidos").sort({ createdAt: -1 }).lean(),
      Material.find({}).populate("alumno", "nombre apellidos").sort({ createdAt: -1 }).lean(),
    ]);

    const leads = leadsDB.map((l) => ({ ...l, id: l._id.toString() }));

    const alumnos = alumnosDB.map((a) => ({
      ...a,
      id: a._id.toString(),
      perfil: a.tipoPerfil || "Privado",
    }));

    const ventas = ventasDB.map((v) => ({
      ...v,
      id: v._id.toString(),
      alumno: v.alumno ? `${v.alumno.nombre} ${v.alumno.apellidos || ""}`.trim() : "Alumno Borrado",
      curso: v.nombreCurso,
      importe: `${v.precio}€`,
      fecha: new Date(v.fechaCompra).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const materiales = materialesDB.map((m) => ({
      ...m,
      id: m._id.toString(),
      alumnoNombre: m.alumno
        ? `${m.alumno.nombre} ${m.alumno.apellidos || ""}`.trim()
        : "Alumno Borrado",
      fechaCompraStr: new Date(m.fechaCompra).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ leads, alumnos, ventas, materiales });
  } catch (error) {
    console.error("Error al obtener datos del Dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
