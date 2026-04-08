import ExportButton from "../views/ExportButton";

// Archivo: components/dashboard/AlumnosView.js
export default function AlumnosView({
  busqueda,
  setBusqueda,
  alumnosProcesados,
  manejarOrden,
  FlechaOrden,
  setAlumnoSeleccionado,
  getBadgeColor,
  filtroEmpresa,
  setFiltroEmpresa,
  empresasUnicas,
  onExportar,
  setMostrarModalImportar,
}) {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 w-full">
        <p className="text-gray-500 font-medium">
          Usuarios registrados en la plataforma con perfil completo.
        </p>

        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setMostrarModalImportar(true)}
            className="flex items-center justify-center gap-2 bg-brand hover:bg-[#2c1a6b] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-sm shrink-0 cursor-pointer w-full lg:w-auto"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Importar por Empresa
          </button>

          <div className="w-full lg:w-auto flex [&>button]:w-full">
            <ExportButton onExportar={onExportar} />
          </div>

          <select
            value={filtroEmpresa}
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            className="w-full lg:w-48 px-5 py-3 rounded-xl border-2 border-brand-border bg-white text-brand font-bold focus:border-brand focus:ring-4 focus:ring-brand-border/50 outline-none transition-all cursor-pointer appearance-none shadow-sm shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2340269A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Todas las empresas</option>
            {empresasUnicas.map((empresa, idx) => (
              <option key={idx} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full flex-1 lg:min-w-72 px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-brand focus:ring-4 focus:ring-brand-subtle outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
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
                onClick={() => manejarOrden("usuario")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Usuario / Email <FlechaOrden columna="usuario" />
              </th>
              <th
                onClick={() => manejarOrden("nombre")}
                className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Nombre Real <FlechaOrden columna="nombre" />
              </th>
              <th
                onClick={() => manejarOrden("perfil")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-brand-border/20 group transition-colors"
              >
                Perfil <FlechaOrden columna="perfil" />
              </th>
              <th
                onClick={() => manejarOrden("activo")}
                className="p-4 font-black text-sm uppercase w-[10%] cursor-pointer hover:bg-brand-border/20 group transition-colors text-center"
              >
                Activo <FlechaOrden columna="activo" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[15%] text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="block lg:table-row-group">
            {alumnosProcesados.length > 0 ? (
              alumnosProcesados.map((alumno) => (
                <tr
                  key={alumno.id}
                  // En móvil, cada fila es una "tarjeta" (block)
                  className="block lg:table-row bg-white mb-4 lg:mb-0 border border-gray-200 lg:border-b lg:border-gray-100 rounded-xl lg:rounded-none shadow-sm lg:shadow-none hover:bg-surface transition-colors p-4 lg:p-0"
                >
                  {/* USUARIO Y EMAIL */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Usuario / Email
                    </span>
                    <div className="font-bold text-brand break-words lg:truncate">
                      @{alumno.username}
                    </div>
                    <div className="text-xs text-gray-400 break-words lg:truncate">
                      {alumno.email}
                    </div>
                  </td>

                  {/* NOMBRE REAL */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Nombre Real
                    </span>
                    <div className="font-bold text-brand">
                      {alumno.nombre || alumno.apellidos
                        ? `${alumno.nombre || ""} ${alumno.apellidos || ""}`.trim()
                        : "—"}
                    </div>
                  </td>

                  {/* PERFIL */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Perfil
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getBadgeColor(alumno.perfil)}`}
                    >
                      {alumno.perfil}
                    </span>
                    <div className="text-xs text-gray-400 mt-1 break-words lg:truncate">
                      {alumno.profesion}
                    </div>
                  </td>

                  {/* ACTIVO */}
                  <td className="block lg:table-cell p-2 lg:p-4 border-b border-gray-50 lg:border-none relative">
                    <span className="lg:hidden font-bold text-gray-400 uppercase text-xs block mb-1">
                      Estado de Cuenta
                    </span>
                    {/* En PC se centra, en móvil a la izquierda con texto */}
                    <div className="flex justify-start lg:justify-center items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${alumno.activo ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      {/* Texto explicativo solo para móviles */}
                      <span className="lg:hidden text-sm font-bold text-gray-600">
                        {alumno.activo ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </td>

                  {/* ACCIÓN */}
                  <td className="block lg:table-cell p-2 lg:p-4 lg:text-right relative mt-2 lg:mt-0">
                    <button
                      onClick={() => setAlumnoSeleccionado(alumno)}
                      className="text-brand bg-brand-border/30 hover:bg-brand-muted hover:text-white px-4 py-3 lg:py-2 rounded-xl font-bold text-sm lg:text-xs transition-all w-full lg:w-auto text-center"
                    >
                      Ver Ficha
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
                  No se ha encontrado ningún alumno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
