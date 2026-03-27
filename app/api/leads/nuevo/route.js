import { NextResponse } from "next/server";
import { getTenantContext, getModel } from "@/lib/withTenant";
import { LeadSchema } from "@/models/Leads";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-tenant",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const ctx = await getTenantContext(request);
    if (ctx.error) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status, headers: corsHeaders });
    }

    const { tenantDb } = ctx;
    const data = await request.json();

    if (!data.email || !data.nombre) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400, headers: corsHeaders }
      );
    }

    const Lead = getModel(tenantDb, "Lead", LeadSchema);
    const nuevoLead = await Lead.create({
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      cursos: data.cursos || [],
      estado: "Nuevo",
    });

    return NextResponse.json(
      { mensaje: "Lead guardado con éxito", lead: nuevoLead },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error al guardar Lead:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Este email ya está registrado en nuestro sistema." },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}
