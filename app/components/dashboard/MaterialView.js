import ExportButton from "../views/ExportButton";

export default function MaterialView({
  busqueda,
  setBusqueda,
  materialesProcesados,
  manejarOrden,
  FlechaOrden,
  setMaterialSeleccionado,
  filtroCategoria,
  setFiltroCategoria,
  categoriasUnicas,
  onExportar,
}) {
  return (
    <div className="animate-fadeIn">
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 w-full">
        <p className="text-gray-500 font-medium">
          Registro histórico de venta de materiales, plantillas y recursos.
        </p>

        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          <div className="w-full lg:w-auto flex [&>button]:w-full">
            <ExportButton onExportar={onExportar} />
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full lg:w-56 px-4 py-3 rounded-xl border-2 border-brand-border bg-white text-brand font-bold focus:border-brand focus:ring-4 focus:ring-brand-border/50 outline-none transition-all cursor-pointer appearance-none shadow-sm shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2340269A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Todas las categorías</option>
            {categoriasUnicas?.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar material o alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full flex-1 lg:min-w-72 px-4 py-3 border-2 border-gray-100 rounded-xl bg-surface text-brand font-bold focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand-subtle transition-all"
          />
        </div>
      </div>

      {/* TABLA RESPONSIVA: En móvil se vuelve "Tarjetas" */}
      <div className="rounded-xl lg:border lg:border-gray-200">
        <table className="w-full text-left border-collapse block lg:table">
          {/* Ocultamos thead en móvil */}
          <thead className="hidden lg:table-header-group">
            <tr className="bg-surface text-brand border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("fechaCompra")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-brand-border/20 transition-colors"
              >
                Fecha <FlechaOrden columna="fechaCompra" />
              </th>
              <th
                onClick={() => manejarOrden("alumnoNombre")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-brand-border/20 transition-colors"
              >
                Alumno <FlechaOrden columna="alumnoNombre" />
              </th>
              <th
                onClick={() => manejarOrden("nombreMaterial")}
                className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-brand-border/20 transition-colors"
              >
                Material <FlechaOrden columna="nombreMaterial" />
              </th>
              <th
                onClick={() => manejarOrden("categoria")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-brand-border/20 transition-colors"
              >
                Categoría <FlechaOrden columna="categoria" />
              </th>
              <th
                onClick={() => manejarOrden("precio")}
                className="p-4 font-black text-sm uppercase w-[10%] cursor-pointer hover:bg-brand-border/20 transition-colors"
              >
                Precio <FlechaOrden columna="precio" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[10%] text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="block lg:table-row-group">
            {materialesProcesados.length > 0 ? (
              materialesProcesados.map((item) => (
                <tr
                  key={item._id || item.id}
                  // En móvil, cada fila es una "tarjeta" (block), con borde y sombra. En PC, fila normal.
                  className="block lg:table-row bg-white mb-4 lg:mb-0 border border-gray-200 lg:border-b lg:border-gray-100 rounded-xl lg:rounded-none shadow-sm lg:shadow-none hover:bg-surface transition-colors p-4 lg:p-0"
                >
                  {/* FECHA */}
                  <td className="block lg:table-cell p-2 lg:p-4 text-gray-500 font-medium border-b border-gray-50 lg:border-none relative">
                    {/* Etiqueta visible solo en móvil */}
                    <span className="lg:hidden font-bold text-brand uppercase text-xs block mb-1">
                      Fecha
                    </span>
                    {item.fechaCompraStr || item.fechaCompra}
                  </td>

                  {/* ALUMNO */}
                  <td className="block lg:table-cell p-2 lg:p-4 font-bold text-brand border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Alumno
                    </span>
                    {item.alumnoNombre || "Desconocido"}
                  </td>

                  {/* MATERIAL */}
                  <td className="block lg:table-cell p-2 lg:p-4 text-gray-700 font-medium border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-brand uppercase text-xs block mb-1">
                      Material
                    </span>
                    {item.nombreMaterial}
                  </td>

                  {/* CATEGORÍA */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Categoría
                    </span>
                    <span className="bg-purple-50 text-brand px-3 py-1.5 rounded-full text-xs font-bold border border-purple-100 whitespace-nowrap inline-block text-center">
                      {item.categoria}
                    </span>
                  </td>

                  {/* PRECIO */}
                  <td className="block lg:table-cell p-2 lg:p-4 font-black text-brand border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Precio
                    </span>
                    {item.precio}€
                  </td>

                  {/* ACCIÓN */}
                  <td className="block lg:table-cell p-2 lg:p-4 lg:text-right relative mt-2 lg:mt-0">
                    <button
                      onClick={() => setMaterialSeleccionado(item)}
                      className="text-brand bg-brand-border/30 hover:bg-brand-muted hover:text-white px-4 py-3 lg:py-2 rounded-xl font-bold text-sm lg:text-xs transition-all w-full lg:w-auto"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="block lg:table-row">
                <td
                  colSpan="6"
                  className="block lg:table-cell p-12 text-center text-gray-400 font-medium border lg:border-none rounded-xl"
                >
                  No se ha encontrado ningún material que coincida con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
