import { NextResponse } from "next/server";
import { getTenantContext, getModel } from "@/lib/withTenant";
import { StudentSchema } from "@/models/Student";

export async function POST(request) {
  try {
    const ctx = await getTenantContext(request);
    if (ctx.error) {
      return NextResponse.json({ error: ctx.error }, { status: ctx.status });
    }

    const { tenantDb } = ctx;
    const { empresa, emails } = await request.json();

    if (!empresa || !emails || emails.length === 0) {
      return NextResponse.json({ error: "Faltan datos o el archivo está vacío" }, { status: 400 });
    }

    const Student = getModel(tenantDb, "Student", StudentSchema);

    const alumnosNuevos = emails.map((email) => ({
      email: email.trim().toLowerCase(),
      tipoPerfil: "Empresa",
      perfil: "Empresa",
      profesion: empresa,
      activo: false,
    }));

    await Student.insertMany(alumnosNuevos, { ordered: false });

    return NextResponse.json(
      { mensaje: `¡Se han importado los alumnos de ${empresa} con éxito!` }
    );
  } catch (error) {
    console.error("Error al importar alumnos:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { mensaje: "Importación terminada, pero se omitieron emails que ya existían." }
      );
    }
    return NextResponse.json({ error: "Error del servidor al importar" }, { status: 500 });
  }
}
