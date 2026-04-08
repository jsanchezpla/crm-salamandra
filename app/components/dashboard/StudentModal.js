export default function StudentModal({ alumno, onClose, getBadgeColor }) {
  if (!alumno) return null;

  return (
    <div className="fixed inset-0 bg-brand/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      {/* Reducimos el borde superior en móvil (border-t-4) y normal en ordenador (md:border-t-8) */}
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-4 md:border-t-8 border-brand-muted">
        {/* Ajustamos el botón de cerrar para que en móvil no se pegue tanto al borde superior */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-brand-subtle hover:text-brand text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-surface p-6 pt-12 md:p-10 border-b border-gray-100">
          {/* MAGIA RESPONSIVA AQUÍ: flex-col en móvil, flex-row en md */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
            {/* Círculo más pequeño en móvil (w-20) y vuelve a su tamaño en ordenador (md:w-24) */}
            <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-brand-border text-brand flex items-center justify-center text-3xl md:text-4xl font-black shadow-inner">
              {/* TRUCO de seguridad por si el nombre viene vacío */}
              {(alumno.nombre || alumno.email || "A").charAt(0).toUpperCase()}
              {(alumno.apellidos || "").charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col items-center md:items-start w-full">
              {/* Título un poco más pequeño en móvil para que quepan nombres largos */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand leading-tight">
                {alumno.nombre || ""} {alumno.apellidos || ""}
              </h2>

              {/* flex-wrap es la clave para que las etiquetas salten de línea en móvil si no caben */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-3 items-center">
                <span className="text-brand font-bold tracking-wide">@{alumno.username}</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(alumno.perfil)} whitespace-nowrap`}
                >
                  Perfil {alumno.perfil}
                </span>

                {alumno.activo ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    ● Activo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                    ● Inactivo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ajustamos los márgenes interiores de la zona de datos */}
        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand-muted uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Datos de Contacto
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Email Principal
              </label>
              <p className="text-brand font-bold text-base md:text-lg break-all">
                {alumno.email}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="text-brand font-medium text-base md:text-lg">
                {alumno.telefono || "No proporcionado"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand-muted uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Dirección y Perfil
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Dirección Física
              </label>
              <p className="text-brand font-medium text-base md:text-lg">
                {alumno.direccion || "Sin dirección"}
              </p>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                {alumno.codigoPostal} {alumno.ciudad ? `- ${alumno.ciudad}` : ""}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Información Profesional
              </label>
              <p className="text-brand font-medium text-base md:text-lg">
                {alumno.esProfesional ? "Profesional" : "Estudiante / Particular"}
              </p>
              <p className="text-gray-500 font-medium text-sm md:text-base">
                {alumno.profesion || "Sin especificar"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
