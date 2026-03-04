// Archivo: components/dashboard/StatsView.js
export default function StatsView({ leads, alumnos, ventas }) {
  // ============================================================================
  // 🧠 EL CEREBRO: CÁLCULO DE ESTADÍSTICAS EN TIEMPO REAL
  // ============================================================================

  // 1. Rendimiento Económico
  const ingresosTotales = ventas.reduce((total, venta) => {
    // 1. Si venta.importe no existe, le asignamos "0" por defecto.
    // Además, lo forzamos a ser un texto (String) por si acaso en la BD se guardó como número.
    const importeSeguro = venta.importe ? String(venta.importe) : "0";

    // 2. Ahora sí podemos quitarle el símbolo y pasarlo a número con seguridad
    const valorNum = parseFloat(importeSeguro.replace("€", ""));

    return total + (isNaN(valorNum) ? 0 : valorNum);
  }, 0);

  const ticketMedio = ventas.length > 0 ? (ingresosTotales / ventas.length).toFixed(2) : 0;

  // 2. Salud de la Comunidad (Alumnos)
  const totalAlumnos = alumnos.length;
  const alumnosActivos = alumnos.filter((a) => a.activo).length;
  const porcentajeActivos =
    totalAlumnos > 0 ? Math.round((alumnosActivos / totalAlumnos) * 100) : 0;

  const empresas = alumnos.filter((a) => a.perfil === "Empresa").length;
  const particulares = totalAlumnos - empresas;
  const porcentajeEmpresas = totalAlumnos > 0 ? Math.round((empresas / totalAlumnos) * 100) : 0;

  // 3. Demanda de Cursos (Extrayendo qué cursos piden más los Leads)
  const contadorCursos = {};
  leads.forEach((lead) => {
    lead.cursos.forEach((curso) => {
      contadorCursos[curso] = (contadorCursos[curso] || 0) + 1;
    });
  });

  const totalLeads = leads.length;
  const leadsNuevos = leads.filter((l) => l.estado === "Nuevo").length;
  const leadsContactados = leads.filter((l) => l.estado === "Contactado").length;
  const porcentajeContactados =
    totalLeads > 0 ? Math.round((leadsContactados / totalLeads) * 100) : 0;

  // Convertimos el objeto a un array, lo ordenamos de mayor a menor y sacamos el Top 3
  const topCursosDemanda = Object.entries(contadorCursos)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 3);

  const maxDemanda = topCursosDemanda.length > 0 ? topCursosDemanda[0].cantidad : 1;

  // ============================================================================
  // 🎨 LA VISTA: DISEÑO DEL DASHBOARD
  // ============================================================================
  return (
    <div className="animate-fadeIn space-y-8">
      <div className="mb-8">
        <p className="text-gray-500 font-medium">
          Visión general de tu negocio. Datos calculados en tiempo real.
        </p>
      </div>

      {/* FILA 1: KPIs (Tarjetas de métricas principales) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta 1: Ingresos */}
        <div className="bg-gradient-to-br from-[#40269A] to-[#6A4BC4] p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl"></div>
          <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">
            Ingresos Totales
          </h3>
          <div className="text-5xl font-black">{ingresosTotales}€</div>
          <p className="text-green-300 font-bold text-sm mt-3">↑ +12% este mes</p>
        </div>

        {/* Tarjeta 2: Ticket Medio */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
            Ticket Medio
          </h3>
          <div className="text-4xl font-black text-[#40269A]">{ticketMedio}€</div>
          <p className="text-gray-400 font-medium text-sm mt-2">Por cada venta realizada</p>
        </div>

        {/* Tarjeta 3: Gestión de Leads (Tasas de Contacto) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
            Tasa de Contacto (Leads)
          </h3>
          <div className="text-4xl font-black text-[#FF0188]">
            {porcentajeContactados}%{" "}
            <span className="text-xl text-gray-400 font-bold">contactados</span>
          </div>
          <div className="text-gray-500 font-medium text-sm mt-3 flex items-center gap-4">
            <span className="bg-[#FFDAED]/50 text-[#FF0188] px-3 py-1 rounded-lg">
              <span className="font-black">{leadsNuevos}</span> Nuevos
            </span>
            <span className="bg-[#DEC7FF]/30 text-[#40269A] px-3 py-1 rounded-lg">
              <span className="font-black">{leadsContactados}</span> Contactados
            </span>
          </div>
        </div>
      </div>

      {/* FILA 2: Gráficas visuales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica Izquierda: Demanda de Cursos (Barras Horizontales Tailwind) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[#40269A] font-black text-xl mb-6 flex justify-between items-center">
            Top Intereses (Leads)
            <span className="text-xs bg-[#FFDAED] text-[#FF0188] px-3 py-1 rounded-full uppercase tracking-wider">
              Demanda
            </span>
          </h3>

          <div className="space-y-5">
            {topCursosDemanda.length > 0 ? (
              topCursosDemanda.map((curso, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                    <span>{curso.nombre}</span>
                    <span className="text-[#FF0188]">{curso.cantidad} leads</span>
                  </div>
                  {/* La barra de fondo gris */}
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    {/* La barra de color cuyo ancho depende del % de demanda */}
                    <div
                      className="bg-gradient-to-r from-[#FF0188] to-[#FFDAED] h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(curso.cantidad / maxDemanda) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 font-medium">No hay datos de cursos todavía.</p>
            )}
          </div>
        </div>

        {/* Gráfica Derecha: Salud y Perfil de Alumnos */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-8">
          {/* Ratio 1: Activos vs Inactivos */}
          <div>
            <h3 className="text-[#40269A] font-black text-lg mb-4">Salud de la Comunidad</h3>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>🟢 Activos ({porcentajeActivos}%)</span>
              <span>🔴 Inactivos ({100 - porcentajeActivos}%)</span>
            </div>
            {/* Barra de progreso combinada */}
            <div className="w-full bg-red-100 flex rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-400 h-4 transition-all duration-1000"
                style={{ width: `${porcentajeActivos}%` }}
              ></div>
            </div>
          </div>

          <hr className="border-gray-50" />

          {/* Ratio 2: Tipo de Perfil (B2B vs B2C) */}
          <div>
            <h3 className="text-[#40269A] font-black text-lg mb-4">Perfil de Clientes</h3>
            <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
              <span>B2B (Empresa) - {porcentajeEmpresas}%</span>
              <span>B2C (Particulares) - {100 - porcentajeEmpresas}%</span>
            </div>
            {/* Barra de progreso combinada usando tus colores */}
            <div className="w-full bg-[#DEC7FF] flex rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#40269A] h-4 transition-all duration-1000"
                style={{ width: `${porcentajeEmpresas}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
