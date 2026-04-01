// Archivo: lib/exportExcel.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Mapa de colores corporativos de Aumenta (Versión Alto Contraste)
const COLORES_AUMENTA = {
  fondoCabecera: "FF40269A", // Morado Oscuro Aumenta
  textoCabecera: "FFFFFFFF", // Blanco puro
  bordes: "FF7C69A9", // Morado grisáceo más oscuro y marcado
  textoDatos: "FF000000", // Negro puro para máxima legibilidad
};

export const exportarAExcel = async (datos, nombreArchivo, tipo) => {
  if (!datos || datos.length === 0) {
    alert("No hay datos para exportar con los filtros actuales.");
    return;
  }

  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet("Datos Aumenta");

  let cabeceras = [];
  let filas = [];

  // Definiciones de datos
  if (tipo === "ventas") {
    cabeceras = ["Fecha", "Alumno", "Curso", "Importe"];
    filas = datos.map((v) => [v.fecha, v.alumno, v.curso, v.importe]);
  } else if (tipo === "leads") {
    cabeceras = [
      "Nombre",
      "Apellidos",
      "Email",
      "Teléfono",
      "Tipo Usuario",
      "Motivo",
      "Servicio",
      "Curso",
      "Mensaje",
      "Estado",
      "Fecha Ingreso",
    ];
    filas = datos.map((l) => [
      l.nombre,
      l.apellidos,
      l.email,
      l.telefono,
      l.tipo_usuario || "",
      l.motivo || "",
      l.servicio || "",
      l.curso || "",
      l.mensaje || "",
      l.estado,
      l.fecha,
    ]);
  } else if (tipo === "alumnos") {
    cabeceras = [
      "Nombre",
      "Apellidos",
      "Email",
      "Teléfono",
      "Perfil",
      "Empresa/Profesión",
      "Activo",
    ];
    filas = datos.map((a) => [
      a.nombre,
      a.apellidos,
      a.email,
      a.telefono,
      a.tipoPerfil || a.perfil,
      a.profesion || a.empresa,
      a.activo ? "Sí" : "No",
    ]);
  } else if (tipo === "materiales") {
    cabeceras = ["Fecha Compra", "Alumno", "Material", "Categoría", "Precio"];
    filas = datos.map((m) => [
      m.fechaCompraStr || m.fechaCompra,
      m.alumno?.nombre || m.alumnoNombre,
      m.nombreMaterial,
      m.categoria,
      m.precio,
    ]);
  }

  // --- 1. CONFIGURACIÓN DE CABECERA Y ESTILOS DE CABECERA ---
  const filaCabecera = hoja.addRow(cabeceras);

  filaCabecera.font = {
    name: "Calibri", // Fuente nativa de Excel
    bold: true,
    color: { argb: COLORES_AUMENTA.textoCabecera },
    size: 12, // Un poco más grande
  };
  filaCabecera.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: COLORES_AUMENTA.fondoCabecera },
  };
  filaCabecera.height = 26;
  filaCabecera.alignment = { vertical: "middle", horizontal: "center" };

  // --- 2. CONFIGURACIÓN DE FILAS DE DATOS Y ESTILOS GLOBALES ---
  hoja.addRows(filas);

  hoja.eachRow((row, rowNumber) => {
    // Estilo para los datos (texto negro y fuente más clara)
    if (rowNumber > 1) {
      row.font = { name: "Calibri", size: 11, color: { argb: COLORES_AUMENTA.textoDatos } };
      row.height = 22;
      row.alignment = { vertical: "middle" };
    }

    // Bordes más oscuros y definidos
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: COLORES_AUMENTA.bordes } },
        left: { style: "thin", color: { argb: COLORES_AUMENTA.bordes } },
        bottom: { style: "thin", color: { argb: COLORES_AUMENTA.bordes } },
        right: { style: "thin", color: { argb: COLORES_AUMENTA.bordes } },
      };
    });
  });

  // --- 3. CÁLCULO DINÁMICO DE ANCHO DE COLUMNAS ---
  cabeceras.forEach((h, i) => {
    let maxLen = h.length;

    filas.forEach((f) => {
      const cellVal = String(f[i] || "");
      if (cellVal.length > maxLen) {
        maxLen = cellVal.length;
      }
    });

    const columnWidth = Math.min(50, Math.max(12, maxLen + 5));
    hoja.getColumn(i + 1).width = columnWidth;
  });

  // --- 4. GENERACIÓN Y DESCARGA ---
  const buffer = await libro.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const nombreFinal = `${nombreArchivo}_${new Date().toISOString().split("T")[0]}.xlsx`;
  saveAs(blob, nombreFinal);
};
