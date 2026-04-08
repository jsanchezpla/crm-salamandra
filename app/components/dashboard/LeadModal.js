const MOTIVO_LABEL = {
  diagnostico: "Diagnóstico",
  servicios: "Servicios",
  cursos: "Cursos",
};

const MOTIVO_BADGE = {
  diagnostico: "bg-orange-50 text-orange-700 border border-orange-200",
  servicios: "bg-teal-50 text-teal-700 border border-teal-200",
  cursos: "bg-blue-50 text-blue-700 border border-blue-100",
};

const TIPO_USUARIO_LABEL = {
  ciudadano: "Ciudadano",
  profesional: "Profesional sanitario",
};

export default function LeadModal({ lead, onClose, getBadgeColor, onUpdateEstado }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-brand/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-4 md:border-t-8 border-brand">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-brand-subtle hover:text-brand text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-surface p-6 pt-12 md:p-10 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-brand-subtle text-brand flex items-center justify-center text-3xl md:text-4xl font-black shadow-inner">
              {(lead.nombre || "L").charAt(0).toUpperCase()}
              {(lead.apellidos || "").charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col items-center md:items-start w-full">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-brand leading-tight">
                {lead.nombre} {lead.apellidos}
              </h2>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-3 items-center">
                <span className="text-gray-500 font-bold tracking-wide bg-gray-100 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                  Entró el{" "}
                  {new Date(lead.fecha || lead.createdAt)
                    .toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, "-")}
                </span>

                <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                    lead.estado
                  )} whitespace-nowrap`}
                >
                  Estado: {lead.estado}
                </span>

                {lead.tipo_usuario && (
                  <>
                    <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span className="text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                      {TIPO_USUARIO_LABEL[lead.tipo_usuario] || lead.tipo_usuario}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* INFORMACIÓN DE CONTACTO */}
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Información de Contacto
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-base md:text-lg font-bold text-brand hover:text-brand hover:underline decoration-2 underline-offset-4 transition-all break-all"
                >
                  {lead.email}
                </a>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(lead.email);
                  }}
                  className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand-subtle rounded-md transition-all group shrink-0"
                  title="Copiar email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="text-brand font-medium text-base md:text-lg mt-1">
                {lead.telefono || "No proporcionado"}
              </p>
            </div>
          </div>

          {/* MOTIVO DE CONSULTA */}
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-brand uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Motivo de Consulta
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Tipo de consulta
              </label>
              <div className="mt-2">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    MOTIVO_BADGE[lead.motivo] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {MOTIVO_LABEL[lead.motivo] || lead.motivo}
                </span>
              </div>
            </div>

            {lead.motivo === "cursos" && lead.curso && (
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-wide block">
                  Curso de interés
                </label>
                <p className="text-brand font-black text-base mt-2">{lead.curso}</p>
              </div>
            )}

            {lead.motivo === "servicios" && lead.servicio && (
              <div className="bg-teal-50 p-5 rounded-xl border border-teal-100">
                <label className="text-xs font-bold text-teal-600 uppercase tracking-wide block">
                  Servicio de interés
                </label>
                <p className="text-brand font-black text-base mt-2">{lead.servicio}</p>
              </div>
            )}

            {lead.motivo === "diagnostico" && lead.mensaje && (
              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <label className="text-xs font-bold text-orange-600 uppercase tracking-wide block">
                  Mensaje
                </label>
                <p className="text-gray-700 font-medium text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                  {lead.mensaje}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 p-4 md:p-6 lg:px-10 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
          <a
            href={`mailto:${lead.email}`}
            className="sm:mr-auto flex items-center justify-center gap-2 text-white bg-brand px-6 py-3 rounded-xl font-bold hover:bg-[#2c1a6b] transition-colors shadow-md w-full sm:w-auto text-sm md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Escribir Email
          </a>

          {lead.estado === "Nuevo" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Contactado");
                onClose();
              }}
              className="text-brand border-2 border-brand-border bg-white px-6 py-3 rounded-xl font-bold hover:bg-brand-border/30 transition-colors w-full sm:w-auto text-sm md:text-base"
            >
              Marcar como Contactado
            </button>
          )}

          {lead.estado === "Contactado" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Nuevo");
                onClose();
              }}
              className="text-gray-500 border-2 border-gray-200 bg-white px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:text-gray-700 transition-colors w-full sm:w-auto text-sm md:text-base"
            >
              Desmarcar Contactado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
