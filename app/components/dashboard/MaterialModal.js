// Archivo: components/dashboard/MaterialModal.js
export default function MaterialModal({ material, onClose }) {
  if (!material) return null;

  // Extraemos el nombre del alumno (dependiendo de cómo te lo mande tu API)
  const nombreAlumno = material.alumno?.nombre
    ? `${material.alumno.nombre} ${material.alumno.apellidos || ""}`
    : material.alumnoNombre || "Alumno Desconocido";

  return (
    <div className="fixed inset-0 bg-brand/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      {/* Ajustamos el borde superior para móvil (border-t-4) */}
      <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-4 md:border-t-8 border-brand">
        {/* BOTÓN CERRAR: reposicionado para móvil */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-brand-subtle hover:text-brand text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        {/* CABECERA DEL MODAL: padding reducido en móvil y texto centrado */}
        <div className="bg-surface p-6 pt-12 md:p-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="w-full text-center md:text-left">
              <span className="text-xs font-bold tracking-widest text-brand uppercase bg-brand-subtle/50 px-3 py-1.5 rounded-md mb-3 inline-block">
                {material.categoria}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand mt-1 leading-tight">
                {material.nombreMaterial}
              </h2>
            </div>
          </div>
        </div>

        {/* CUERPO DEL MODAL: grid adaptado y paddings reducidos */}
        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Columna Izquierda: Datos de la Compra */}
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Detalles de Venta
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Fecha de Compra
              </label>
              <p className="text-brand font-bold text-base md:text-lg mt-1">
                {material.fechaCompraStr || material.fechaCompra}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Importe Cobrado
              </label>
              <p className="text-brand font-black text-2xl md:text-3xl mt-1">
                {material.precio}€
              </p>
            </div>
          </div>

          {/* Columna Derecha: Datos del Alumno */}
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Comprador
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block text-center md:text-left">
                Alumno Vinculado
              </label>
              <p className="text-brand font-bold text-base md:text-lg mt-1 truncate text-center md:text-left">
                {nombreAlumno}
              </p>

              {/* Si tu API trae el email del alumno, lo mostramos. */}
              {material.alumno?.email && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block text-center md:text-left">
                    Email
                  </label>
                  <p className="text-gray-600 font-medium text-sm mt-1 break-all text-center md:text-left">
                    {material.alumno.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PIE DEL MODAL: botón de ancho completo en móvil */}
        <div className="bg-gray-50 p-4 md:p-6 lg:px-10 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto text-gray-500 border-2 border-gray-200 bg-white px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
