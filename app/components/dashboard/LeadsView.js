// Archivo: components/dashboard/LeadsView.js
export default function LeadsView({
  busqueda,
  setBusqueda,
  leadsProcesados,
  manejarOrden,
  FlechaOrden,
  setLeadSeleccionado,
  getBadgeColor,
}) {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <p className="text-gray-500 font-medium">
          Usuarios que han pedido información desde la web pero aún no han comprado.
        </p>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar lead, email, curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-[#fcfaff] text-[#40269A] font-bold focus:outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-[#fcfaff] text-[#40269A] border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("nombre")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Nombre y Email <FlechaOrden columna="nombre" />
              </th>
              <th
                onClick={() => manejarOrden("curso")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Curso de Interés <FlechaOrden columna="curso" />
              </th>
              <th
                onClick={() => manejarOrden("estado")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Estado <FlechaOrden columna="estado" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[20%] text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {leadsProcesados.length > 0 ? (
              leadsProcesados.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-100 hover:bg-[#fcfaff] transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-[#40269A] truncate">
                      {lead.nombre} {lead.apellidos}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{lead.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.cursos.map((curso, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100 whitespace-nowrap"
                        >
                          {curso}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(lead.estado)}`}
                    >
                      {lead.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setLeadSeleccionado(lead)}
                      className="text-[#FF0188] bg-[#FFDAED]/50 hover:bg-[#FF0188] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                    >
                      Atender Lead
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-400 font-medium">
                  No se ha encontrado ningún lead que coincida con &quot;{busqueda}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
