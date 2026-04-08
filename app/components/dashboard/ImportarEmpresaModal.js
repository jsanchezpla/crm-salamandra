// Archivo: components/dashboard/ImportarEmpresaModal.js
import { useState } from "react";
import ExcelJS from "exceljs"; // <-- Importamos la librería que ya tienes

export default function ImportarEmpresaModal({ onClose, empresasExistentes, onImportarExito }) {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [nuevaEmpresa, setNuevaEmpresa] = useState("");
  const [modoNueva, setModoNueva] = useState(false);
  const [cargando, setCargando] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const manejarSubidaArchivo = async (evento) => {
    const empresaFinal = modoNueva ? nuevaEmpresa.trim() : empresaSeleccionada;

    if (!empresaFinal) {
      alert("Por favor, selecciona o escribe el nombre de una empresa primero.");
      evento.target.value = null;
      return;
    }

    const archivo = evento.target.files[0];
    if (!archivo) return;

    setCargando(true);

    try {
      // 1. Leemos el archivo Excel como un Buffer en la memoria del navegador
      const buffer = await archivo.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      // 2. Cogemos la primera pestaña del Excel
      const worksheet = workbook.worksheets[0];
      const emailsValidos = [];

      // 3. Recorremos todas las filas buscando emails en la primera columna (columna 1)
      worksheet.eachRow((row, rowNumber) => {
        const valorCelda = row.getCell(1).value;
        let textoCelda = "";

        // A veces Excel guarda los emails como enlaces (hipervínculos), así que extraemos el texto
        if (typeof valorCelda === "object" && valorCelda !== null) {
          textoCelda = valorCelda.text || valorCelda.hyperlink || "";
        } else {
          textoCelda = String(valorCelda || "");
        }

        textoCelda = textoCelda.replace("mailto:", "").trim(); // Limpiamos por si acaso

        if (textoCelda && emailRegex.test(textoCelda)) {
          emailsValidos.push(textoCelda);
        }
      });

      if (emailsValidos.length === 0) {
        alert("No se ha encontrado ningún email en la primera columna del Excel.");
        setCargando(false);
        evento.target.value = null;
        return;
      }

      // 4. Enviamos al backend
      const res = await fetch("/api/alumnos/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa: empresaFinal, emails: emailsValidos }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${data.mensaje} (${emailsValidos.length} emails procesados)`);
        onImportarExito();
        onClose();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al procesar Excel:", error);
      alert("Ocurrió un error al leer el Excel. Asegúrate de que no está dañado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl animate-fadeIn border-t-8 border-brand">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand font-black w-8 h-8 rounded-full hover:bg-brand-subtle transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black text-brand mb-2">Importar Excel</h2>
        <p className="text-gray-500 text-sm mb-6">
          Sube un archivo <strong>.xlsx</strong> con los emails de los alumnos en la primera
          columna.
        </p>

        <div className="space-y-5">
          {/* SECTOR DE EMPRESA */}
          {!modoNueva ? (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Selecciona la Empresa
              </label>
              <select
                value={empresaSeleccionada}
                onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-brand-border text-brand font-bold outline-none cursor-pointer"
              >
                <option value="">-- Elige una empresa --</option>
                {empresasExistentes.map((emp, idx) => (
                  <option key={idx} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setModoNueva(true)}
                className="text-brand text-sm font-bold mt-2 hover:underline"
              >
                + Crear nueva empresa
              </button>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Nombre de la Nueva Empresa
              </label>
              <input
                type="text"
                value={nuevaEmpresa}
                onChange={(e) => setNuevaEmpresa(e.target.value)}
                placeholder="Ej: Centro Aumenta"
                className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-brand font-bold outline-none focus:border-brand"
              />
              <button
                onClick={() => setModoNueva(false)}
                className="text-gray-500 text-sm font-bold mt-2 hover:underline"
              >
                Volver a la lista
              </button>
            </div>
          )}

          <hr className="border-gray-100" />

          {/* ZONA DE SUBIDA */}
          <div className="pt-2">
            <label
              className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${cargando ? "bg-gray-100 border-gray-300" : "border-brand-border bg-surface hover:bg-brand-subtle/30 hover:border-brand"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-10 w-10 mb-2 ${cargando ? "text-gray-400 animate-bounce" : "text-[#217346]"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Icono de Excel */}
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <span className="font-bold text-brand">
                {cargando ? "Leyendo Excel..." : "Seleccionar Archivo .xlsx"}
              </span>
              <span className="text-xs text-gray-400 mt-1">Columna A = Emails</span>
              <input
                type="file"
                accept=".xlsx"
                onChange={manejarSubidaArchivo}
                disabled={cargando}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
