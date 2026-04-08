import ExportButton from "../views/ExportButton";

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

function getConsultaDetalle(lead) {
  if (lead.motivo === "diagnostico") return lead.mensaje || "—";
  if (lead.motivo === "servicios") return lead.servicio || "—";
  if (lead.motivo === "cursos") return lead.curso || "—";
  return "—";
}

// Archivo: components/dashboard/LeadsView.js
export default function LeadsView({
  busqueda,
  setBusqueda,
  leadsProcesados,
  manejarOrden,
  FlechaOrden,
  setLeadSeleccionado,
  getBadgeColor,
  filtroMotivo,
  setFiltroMotivo,
  onExportar,
}) {
  return (
    <div className="animate-fadeIn">
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 w-full">
        <p className="text-gray-500 font-medium">
          Usuarios que han pedido información desde la web pero aún no han comprado.
        </p>

        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          <div className="w-full lg:w-auto flex [&>button]:w-full">
            <ExportButton onExportar={onExportar} />
          </div>

          {/* FILTRO DE MOTIVO */}
          <select
            value={filtroMotivo}
            onChange={(e) => setFiltroMotivo(e.target.value)}
            className="w-full lg:w-56 px-4 py-3 rounded-xl border-2 border-brand-border bg-white text-brand font-bold focus:border-brand focus:ring-4 focus:ring-brand-border/50 outline-none transition-all cursor-pointer appearance-none shadow-sm shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2340269A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Todos los motivos</option>
            <option value="diagnostico">Diagnóstico</option>
            <option value="servicios">Servicios</option>
            <option value="cursos">Cursos</option>
          </select>

          {/* BUSCADOR DE TEXTO */}
          <input
            type="text"
            placeholder="Buscar lead, email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full flex-1 lg:min-w-72 px-4 py-3 border-2 border-gray-100 rounded-xl bg-surface text-brand font-bold focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand-subtle transition-all"
          />
        </div>
      </div>

      {/* TABLA RESPONSIVA: En móvil se vuelve "Tarjetas" */}
      <div className="rounded-xl lg:border lg:border-gray-200">
        <table className="w-full text-left border-collapse block lg:table">
          <thead className="hidden lg:table-header-group">
            <tr className="bg-surface text-brand border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("nombre")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Nombre y Email <FlechaOrden columna="nombre" />
              </th>
              <th
                onClick={() => manejarOrden("motivo")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Motivo <FlechaOrden columna="motivo" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[25%]">
                Detalle
              </th>
              <th
                onClick={() => manejarOrden("estado")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Estado <FlechaOrden columna="estado" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[15%] text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="block lg:table-row-group">
            {leadsProcesados.length > 0 ? (
              leadsProcesados.map((lead) => (
                <tr
                  key={lead.id}
                  className="block lg:table-row bg-white mb-4 lg:mb-0 border border-gray-200 lg:border-b lg:border-gray-100 rounded-xl lg:rounded-none shadow-sm lg:shadow-none hover:bg-surface transition-colors p-4 lg:p-0"
                >
                  {/* NOMBRE Y EMAIL */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Nombre y Email
                    </span>
                    <div className="font-bold text-brand break-words lg:truncate">
                      {lead.nombre} {lead.apellidos}
                    </div>
                    <div className="text-xs text-gray-400 break-words lg:truncate">
                      {lead.email}
                    </div>
                  </td>

                  {/* MOTIVO */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Motivo
                    </span>
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        MOTIVO_BADGE[lead.motivo] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {MOTIVO_LABEL[lead.motivo] || lead.motivo}
                    </span>
                  </td>

                  {/* DETALLE */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Detalle
                    </span>
                    <span className="text-sm text-gray-600 lg:truncate block max-w-xs">
                      {getConsultaDetalle(lead)}
                    </span>
                  </td>

                  {/* ESTADO */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Estado
                    </span>
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getBadgeColor(lead.estado)}`}
                    >
                      {lead.estado}
                    </span>
                  </td>

                  {/* ACCIÓN */}
                  <td className="block lg:table-cell p-2 lg:p-4 lg:text-right relative mt-2 lg:mt-0">
                    <button
                      onClick={() => setLeadSeleccionado(lead)}
                      className="text-brand bg-brand-subtle/50 hover:bg-brand hover:text-white px-4 py-3 lg:py-2 rounded-xl font-bold text-sm lg:text-xs transition-all w-full lg:w-auto text-center"
                    >
                      Atender Lead
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="block lg:table-row">
                <td
                  colSpan="5"
                  className="block lg:table-cell p-12 text-center text-gray-400 font-medium border lg:border-none rounded-xl"
                >
                  No se ha encontrado ningún lead que coincida con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
