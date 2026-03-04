import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Leads";
import Student from "@/models/Student";
import Purchase from "@/models/Purchase";

export async function GET() {
  try {
    await dbConnect();

    // 1. Limpieza total de las 3 colecciones
    await Lead.deleteMany({});
    await Student.deleteMany({});
    await Purchase.deleteMany({});

    // 2. Preparamos Leads y Alumnos
    const leadsMocks = [
      {
        nombre: "Laura",
        apellidos: "Gómez",
        email: "laura@ejemplo.com",
        telefono: "+34 600 111 222",
        cursos: ["Marketing Digital", "SEO Avanzado"],
        estado: "Nuevo",
      },
      {
        nombre: "Carlos",
        apellidos: "Ruiz",
        email: "carlos.r@empresa.es",
        telefono: "No proporcionado",
        cursos: ["Diseño UX/UI"],
        estado: "Contactado",
      },
      {
        nombre: "Elena",
        apellidos: "Martín",
        email: "elena99@correo.com",
        telefono: "+34 655 999 888",
        cursos: ["Desarrollo Web", "React", "Next.js"],
        estado: "Nuevo",
      },
    ];

    const alumnosMocks = [
      {
        username: "marcos_dev",
        email: "marcos@tech.es",
        nombre: "Marcos",
        apellidos: "Díaz",
        perfil: "Privado",
        profesion: "Desarrollador Front-End",
        activo: true,
        telefono: "+34 600 123 456",
        direccion: "Calle Larios 14, 2ºB",
        codigoPostal: "29005",
        ciudad: "Málaga",
        tipoPerfil: "Privado",
      },
      {
        username: "sofia_design",
        email: "sofia@estudio.com",
        nombre: "Sofía",
        apellidos: "López",
        perfil: "Empresa",
        profesion: "Directora de Arte",
        activo: true,
        telefono: "+34 611 987 654",
        direccion: "Avenida de la Constitución 8",
        codigoPostal: "41001",
        ciudad: "Sevilla",
        tipoPerfil: "Empresa",
      },
    ];

    // 3. Guardamos Leads y Alumnos en la Base de Datos
    await Lead.insertMany(leadsMocks);
    const alumnosCreados = await Student.insertMany(alumnosMocks);

    // 4. Extraemos los IDs reales que MongoDB acaba de generar para Marcos y Sofía
    const idMarcos = alumnosCreados.find((a) => a.email === "marcos@tech.es")._id;
    const idSofia = alumnosCreados.find((a) => a.email === "sofia@estudio.com")._id;

    // 5. Declaramos las ventas usando los IDs reales y los nombres de tu Schema
    const ventasMocks = [
      {
        fechaCompra: new Date("2026-03-02"),
        alumno: idSofia,
        nombreCurso: "Masterclass Figma",
        precio: 150,
      },
      {
        fechaCompra: new Date("2026-02-28"),
        alumno: idMarcos,
        nombreCurso: "Bootcamp Next.js",
        precio: 450,
      },
      {
        fechaCompra: new Date("2026-03-01"),
        alumno: idSofia,
        nombreCurso: "Diseño UX/UI Avanzado",
        precio: 250,
      },
      {
        fechaCompra: new Date("2026-03-03"),
        alumno: idMarcos,
        nombreCurso: "Desarrollo Web",
        precio: 300,
      },
    ];

    // 6. Finalmente, insertamos las ventas
    await Purchase.insertMany(ventasMocks);

    return NextResponse.json(
      { mensaje: "✅ Semilla plantada con éxito. IDs relacionales creados correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al poblar la BD:", error);
    return NextResponse.json(
      { error: "Hubo un error al rellenar la base de datos", detalle: error.message },
      { status: 500 }
    );
  }
}
