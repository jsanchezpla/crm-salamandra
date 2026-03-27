import { NextResponse } from "next/server";
import { getTenantContext, getModel } from "@/lib/withTenant";
import { LeadSchema } from "@/models/Leads";

export async function PATCH(request, { params }) {
  try {
    const ctx = await getTenantContext(request);
    if (ctx.error) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status });
    }

    const { tenantDb } = ctx;
    const { id } = await params;
    const { estado } = await request.json();

    if (!estado) {
      return NextResponse.json({ error: "Falta el estado a actualizar" }, { status: 400 });
    }

    const Lead = getModel(tenantDb, "Lead", LeadSchema);
    const leadActualizado = await Lead.findByIdAndUpdate(
      id,
      { estado },
      { returnDocument: "after" }
    );

    if (!leadActualizado) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ mensaje: "¡Estado actualizado en BD!", lead: leadActualizado });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
