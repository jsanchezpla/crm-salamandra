export default function StudentModal({ alumno, onClose, getBadgeColor }) {
  if (!alumno) return null;

  return (
    <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-8 border-[#C49DFF]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-[#fcfaff] p-8 lg:p-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#DEC7FF] text-[#40269A] flex items-center justify-center text-4xl font-black shadow-inner">
              {alumno.nombre.charAt(0)}
              {alumno.apellidos.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#40269A]">
                {alumno.nombre} {alumno.apellidos}
              </h2>
              <div className="flex gap-3 mt-3 items-center">
                <span className="text-[#FF0188] font-bold tracking-wide">@{alumno.username}</span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(alumno.perfil)}`}
                >
                  Perfil {alumno.perfil}
                </span>
                {alumno.activo ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    ● Activo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    ● Inactivo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#C49DFF] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Datos de Contacto
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Email Principal
              </label>
              <p className="text-[#40269A] font-bold text-lg">{alumno.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="text-[#40269A] font-medium text-lg">{alumno.telefono}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#C49DFF] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Dirección y Perfil
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Dirección Física
              </label>
              <p className="text-[#40269A] font-medium text-lg">{alumno.direccion}</p>
              <p className="text-gray-500 font-medium">
                {alumno.codigoPostal} - {alumno.ciudad}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Información Profesional
              </label>
              <p className="text-[#40269A] font-medium text-lg">
                {alumno.esProfesional ? "Profesional" : "Estudiante / Particular"}
              </p>
              <p className="text-gray-500 font-medium">{alumno.profesion || "Sin especificar"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
