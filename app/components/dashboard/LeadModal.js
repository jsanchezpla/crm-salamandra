export default function LeadModal({ lead, onClose, getBadgeColor, onUpdateEstado }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-8 border-[#FF0188]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-[#fcfaff] p-8 lg:p-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#FFDAED] text-[#FF0188] flex items-center justify-center text-4xl font-black shadow-inner">
              {lead.nombre.charAt(0)}
              {lead.apellidos.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#40269A]">
                {lead.nombre} {lead.apellidos}
              </h2>
              <div className="flex gap-3 mt-3 items-center">
                <span className="text-gray-500 font-bold tracking-wide bg-gray-100 px-3 py-1 rounded-full text-xs">
                  Entró el {lead.fecha}
                </span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(lead.estado)}`}
                >
                  Estado: {lead.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#FF0188] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Información de Contacto
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <p className="text-[#40269A] font-bold text-lg">{lead.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="text-[#40269A] font-medium text-lg">{lead.telefono}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-black text-[#FF0188] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Oportunidad de Venta
            </h3>
            <div className="bg-[#FFDAED]/30 p-5 rounded-xl border border-[#FFDAED]">
              <label className="text-xs font-bold text-[#FF0188] uppercase tracking-wide">
                Cursos en los que está interesado ({lead.cursos.length})
              </label>
              <div className="flex flex-wrap gap-2 mt-3">
                {lead.cursos.map((curso, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-[#40269A] font-black px-4 py-2 rounded-lg border border-[#DEC7FF] text-sm shadow-sm"
                  >
                    {curso}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 lg:px-10 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
          {/* Si es NUEVO, mostramos el botón para contactar */}
          {lead.estado === "Nuevo" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Contactado");
                onClose();
              }}
              className="text-[#40269A] border-2 border-[#DEC7FF] bg-white px-6 py-3 rounded-xl font-bold hover:bg-[#DEC7FF]/30 transition-colors"
            >
              Marcar como Contactado
            </button>
          )}

          {/* Si ya está CONTACTADO, mostramos el botón para revertir el error */}
          {lead.estado === "Contactado" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Nuevo");
                onClose();
              }}
              className="text-gray-500 border-2 border-gray-200 bg-white px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              Desmarcar Contactado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
