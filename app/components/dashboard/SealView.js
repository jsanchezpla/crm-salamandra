// Archivo: components/dashboard/VentasView.js
export default function VentasView({
  busqueda,
  setBusqueda,
  ventasProcesadas,
  manejarOrden,
  FlechaOrden,
  setVentaSeleccionada,
}) {
  return (
    <div className="animate-fadeIn">
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <p className="text-gray-500 font-medium">
          Registro histórico de qué curso ha comprado cada usuario.
        </p>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar alumno, curso, fecha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl bg-[#fcfaff] text-[#40269A] font-bold focus:outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all"
          />
        </div>
      </div>

      {/* TABLA DE VENTAS */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-[#fcfaff] text-[#40269A] border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("fecha")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Fecha <FlechaOrden columna="fecha" />
              </th>
              <th
                onClick={() => manejarOrden("alumno")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Alumno <FlechaOrden columna="alumno" />
              </th>
              <th
                onClick={() => manejarOrden("curso")}
                className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Curso Adquirido <FlechaOrden columna="curso" />
              </th>
              <th
                onClick={() => manejarOrden("importe")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Importe <FlechaOrden columna="importe" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[10%] text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {ventasProcesadas.length > 0 ? (
              ventasProcesadas.map((venta) => (
                <tr
                  key={venta.id}
                  className="border-b border-gray-100 hover:bg-[#fcfaff] transition-colors"
                >
                  <td className="p-4 text-gray-500 font-medium">{venta.fecha}</td>
                  <td className="p-4 font-bold text-[#40269A] truncate">{venta.alumno}</td>
                  <td className="p-4 text-gray-700 truncate">{venta.curso}</td>
                  <td className="p-4 font-black text-[#FF0188]">{venta.importe}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setVentaSeleccionada(venta)}
                      className="text-[#40269A] bg-[#DEC7FF]/30 hover:bg-[#C49DFF] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                  No se ha encontrado ninguna venta que coincida con &quot;{busqueda}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
