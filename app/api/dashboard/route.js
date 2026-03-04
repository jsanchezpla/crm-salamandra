// Archivo: app/api/dashboard/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Leads";
import Student from "@/models/Student";
import Purchase from "@/models/Purchase";

export async function GET(request) {
  try {
    // 1. Conectamos a la base de datos
    await dbConnect();

    // Extraemos Leads y Alumnos igual que antes
    const leadsDB = await Lead.find({}).sort({ createdAt: -1 }).lean();
    const alumnosDB = await Student.find({}).sort({ createdAt: -1 }).lean();

    // ATENCIÓN AQUÍ: Usamos populate para traer el nombre y apellidos del alumno referenciado
    const ventasDB = await Purchase.find({})
      .populate("alumno", "nombre apellidos")
      .sort({ createdAt: -1 })
      .lean();

    // Formateamos los datos para que el frontend no se rompa y reciba exactamente lo que espera
    const leads = leadsDB.map((l) => ({ ...l, id: l._id.toString() }));
    const alumnos = alumnosDB.map((a) => ({
      ...a,
      id: a._id.toString(),
      perfil: a.tipoPerfil || "Privado",
    }));

    const ventas = ventasDB.map((v) => {
      // 1. Formateamos la fecha para que se vea como "02 mar 2026"
      const fechaObj = new Date(v.fechaCompra);
      const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        ...v,
        id: v._id.toString(),
        alumno: v.alumno ? `${v.alumno.nombre} ${v.alumno.apellidos}` : "Alumno Borrado",
        curso: v.nombreCurso,
        // 2. Transformamos el "precio" de la BD al "importe" del frontend añadiendo el €
        importe: `${v.precio}€`,
        // 3. Pasamos la fecha ya bonita
        fecha: fechaFormateada,
      };
    });

    // 4. Enviamos el paquete completo al Dashboard
    return NextResponse.json({ leads, alumnos, ventas }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos del Dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
