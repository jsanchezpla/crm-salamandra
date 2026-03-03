"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [vistaActiva, setVistaActiva] = useState("leads");

  // --- ESTADOS PARA LA INTERFAZ ---
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenColumna, setOrdenColumna] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  // Inicializar cargando basado en la presencia del token
  const [cargando, setCargando] = useState(
    typeof window !== "undefined" && !localStorage.getItem("crm_token")
  );

  // Limpiar el buscador y el ordenamiento cada vez que cambiamos de pestaña
  useEffect(() => {
    setBusqueda("");
    setOrdenColumna(null);
    setOrdenAscendente(true);
  }, [vistaActiva]);

  // --- DATOS DE PRUEBA (MOCK DATA) ENRIQUECIDOS ---
  const [leads] = useState([
    {
      id: 1,
      nombre: "Laura",
      apellidos: "Gómez",
      email: "laura@ejemplo.com",
      telefono: "+34 600 111 222",
      curso: "Marketing Digital",
      estado: "Nuevo",
      fecha: "03 Mar 2026",
    },
    {
      id: 2,
      nombre: "Carlos",
      apellidos: "Ruiz",
      email: "carlos.r@empresa.es",
      telefono: "No proporcionado",
      curso: "Diseño UX/UI",
      estado: "Contactado",
      fecha: "01 Mar 2026",
    },
    {
      id: 3,
      nombre: "Elena",
      apellidos: "Martín",
      email: "elena99@correo.com",
      telefono: "+34 655 999 888",
      curso: "Desarrollo Web",
      estado: "Nuevo",
      fecha: "28 Feb 2026",
    },
  ]);

  const [alumnos] = useState([
    {
      id: 1,
      username: "marcos_dev",
      email: "marcos@tech.es",
      nombre: "Marcos",
      apellidos: "Díaz",
      perfil: "Privado",
      profesion: "Desarrollador Front-End",
      activo: true,
      telefono: "+34 600 123 456",
      direccion: "Calle Larios 14, 2ºB",
      codigoPostal: "29005",
      ciudad: "Málaga",
      esProfesional: true,
    },
    {
      id: 2,
      username: "sofia_design",
      email: "sofia@estudio.com",
      nombre: "Sofía",
      apellidos: "López",
      perfil: "Empresa",
      profesion: "Directora de Arte",
      activo: true,
      telefono: "+34 611 987 654",
      direccion: "Avenida de la Constitución 8",
      codigoPostal: "41001",
      ciudad: "Sevilla",
      esProfesional: true,
    },
    {
      id: 3,
      username: "juan_perez",
      email: "juan@mail.com",
      nombre: "Juan",
      apellidos: "Pérez",
      perfil: "Privado",
      profesion: "Estudiante",
      activo: false,
      telefono: "No proporcionado",
      direccion: "Plaza Mayor 1",
      codigoPostal: "28012",
      ciudad: "Madrid",
      esProfesional: false,
    },
  ]);

  const [ventas] = useState([
    {
      id: 1,
      fecha: "02 Mar 2026",
      alumno: "Sofía López",
      curso: "Masterclass Figma",
      importe: "150€",
    },
    {
      id: 2,
      fecha: "28 Feb 2026",
      alumno: "Marcos Díaz",
      curso: "Bootcamp Next.js",
      importe: "450€",
    },
  ]);

  // --- LÓGICA DE PROCESAMIENTO PARA VENTAS ---
  let ventasProcesadas = ventas.filter((v) => {
    const term = busqueda.toLowerCase();
    return (
      v.alumno.toLowerCase().includes(term) ||
      v.curso.toLowerCase().includes(term) ||
      v.importe.toLowerCase().includes(term) ||
      v.fecha.toLowerCase().includes(term)
    );
  });

  if (ordenColumna && vistaActiva === "ventas") {
    ventasProcesadas.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "fecha":
          vA = new Date(a.fecha).getTime();
          vB = new Date(b.fecha).getTime();
          break;
        case "alumno":
          vA = a.alumno.toLowerCase();
          vB = b.alumno.toLowerCase();
          break;
        case "curso":
          vA = a.curso.toLowerCase();
          vB = b.curso.toLowerCase();
          break;
        case "importe":
          vA = parseFloat(a.importe);
          vB = parseFloat(b.importe);
          break; // Lo pasa a número para ordenar bien
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // --- LÓGICA DE PROCESAMIENTO PARA ALUMNOS ---
  let alumnosProcesados = alumnos.filter((a) => {
    const term = busqueda.toLowerCase();
    return (
      a.nombre.toLowerCase().includes(term) ||
      a.apellidos.toLowerCase().includes(term) ||
      a.username.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term)
    );
  });

  if (ordenColumna && vistaActiva === "alumnos") {
    alumnosProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "usuario":
          vA = a.username.toLowerCase();
          vB = b.username.toLowerCase();
          break;
        case "nombre":
          vA = a.nombre.toLowerCase();
          vB = b.nombre.toLowerCase();
          break;
        case "perfil":
          vA = a.perfil.toLowerCase();
          vB = b.perfil.toLowerCase();
          break;
        case "activo":
          vA = a.activo ? 1 : 0;
          vB = b.activo ? 1 : 0;
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // --- LÓGICA DE PROCESAMIENTO PARA LEADS ---
  let leadsProcesados = leads.filter((l) => {
    const term = busqueda.toLowerCase();
    return (
      l.nombre.toLowerCase().includes(term) ||
      l.apellidos.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term) ||
      l.curso.toLowerCase().includes(term)
    );
  });

  if (ordenColumna && vistaActiva === "leads") {
    leadsProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "nombre":
          vA = a.nombre.toLowerCase();
          vB = b.nombre.toLowerCase();
          break;
        case "curso":
          vA = a.curso.toLowerCase();
          vB = b.curso.toLowerCase();
          break;
        case "estado":
          vA = a.estado.toLowerCase();
          vB = b.estado.toLowerCase();
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  const manejarOrden = (columna) => {
    if (ordenColumna === columna) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(columna);
      setOrdenAscendente(true);
    }
  };

  const FlechaOrden = ({ columna }) => {
    if (ordenColumna !== columna)
      return (
        <span className="text-gray-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          ↕
        </span>
      );
    return ordenAscendente ? (
      <span className="text-[#FF0188] ml-1">↑</span>
    ) : (
      <span className="text-[#FF0188] ml-1">↓</span>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    router.push("/");
  };

  if (cargando)
    return (
      <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center text-[#40269A] font-bold text-xl animate-pulse">
        Cargando tu espacio Aumenta...
      </div>
    );

  const getMenuClass = (vista) => {
    const baseClass = "block p-4 rounded-2xl font-bold transition-all transform cursor-pointer ";
    if (vistaActiva === vista) {
      return (
        baseClass +
        "bg-[#FF0188] text-white shadow-lg shadow-pink-500/30 hover:scale-105 font-black"
      );
    }
    return baseClass + "text-[#C49DFF] hover:bg-[#C49DFF]/20 hover:text-[#40269A]";
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "Nuevo":
        return "bg-[#FFDAED] text-[#FF0188] border border-[#FF0188]/20";
      case "Contactado":
        return "bg-[#DEC7FF] text-[#40269A] border border-[#40269A]/20";
      case "Empresa":
        return "bg-blue-100 text-blue-700";
      case "Privado":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] flex font-glacial relative">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#40269A] text-white flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-8 text-3xl font-black border-b border-[#C49DFF]/30 tracking-widest text-center font-playpen">
          CRM<span className="text-[#FF0188]">.</span>
        </div>
        <nav className="flex-1 p-6 space-y-4 text-sm tracking-wide">
          <div onClick={() => setVistaActiva("leads")} className={getMenuClass("leads")}>
            Leads (Landing)
          </div>
          <div onClick={() => setVistaActiva("alumnos")} className={getMenuClass("alumnos")}>
            Alumnos Activos
          </div>
          <div onClick={() => setVistaActiva("ventas")} className={getMenuClass("ventas")}>
            Historial Ventas
          </div>
        </nav>
        <div className="p-6 border-t border-[#C49DFF]/30">
          <button
            onClick={handleLogout}
            className="w-full p-4 text-xs font-black text-[#C49DFF] hover:text-white border-2 border-[#C49DFF] hover:bg-[#C49DFF]/20 rounded-2xl transition-all tracking-widest"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white p-8 shadow-sm flex justify-between items-center z-0 shrink-0 border-b border-gray-100">
          <h1 className="text-3xl font-black text-[#40269A] tracking-tight">
            {vistaActiva === "leads" && "Gestión de Prospectos"}
            {vistaActiva === "alumnos" && "Directorio de Alumnos"}
            {vistaActiva === "ventas" && "Historial de Ventas"}
          </h1>
          <div className="text-sm font-bold text-[#40269A] bg-[#DEC7FF]/30 px-6 py-3 rounded-full border border-[#C49DFF]/50">
            admin@aumenta.com
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto bg-gradient-to-br from-[#fcfaff] to-[#DEC7FF]/10">
          <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl border-t-[8px] border-[#FFDAED] min-h-full relative">
            {/* ========================================================= */}
            {/* VISTA LEADS COMPLETADA CON BUSCADOR Y ORDENACIÓN */}
            {/* ========================================================= */}
            {vistaActiva === "leads" && (
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

                        <th className="p-4 font-black text-sm uppercase w-[20%] text-right">
                          Acción
                        </th>
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
                            <td className="p-4 text-gray-600 font-medium truncate">{lead.curso}</td>
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
                            No se ha encontrado ningún lead que coincida con "{busqueda}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VISTA ALUMNOS (Mantenemos la que ya funcionaba perfecta) */}
            {/* ========================================================= */}
            {vistaActiva === "alumnos" && (
              <div className="animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <p className="text-gray-500 font-medium">
                    Usuarios registrados en la plataforma con perfil completo.
                  </p>
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      placeholder="Buscar nombre, email, usuario..."
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
                          onClick={() => manejarOrden("usuario")}
                          className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
                        >
                          Usuario / Email <FlechaOrden columna="usuario" />
                        </th>
                        <th
                          onClick={() => manejarOrden("nombre")}
                          className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
                        >
                          Nombre Real <FlechaOrden columna="nombre" />
                        </th>
                        <th
                          onClick={() => manejarOrden("perfil")}
                          className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
                        >
                          Perfil <FlechaOrden columna="perfil" />
                        </th>
                        <th
                          onClick={() => manejarOrden("activo")}
                          className="p-4 font-black text-sm uppercase w-[10%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors text-center"
                        >
                          Activo <FlechaOrden columna="activo" />
                        </th>
                        <th className="p-4 font-black text-sm uppercase w-[15%] text-right">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumnosProcesados.length > 0 ? (
                        alumnosProcesados.map((alumno) => (
                          <tr
                            key={alumno.id}
                            className="border-b border-gray-100 hover:bg-[#fcfaff] transition-colors"
                          >
                            <td className="p-4">
                              <div className="font-bold text-[#40269A] truncate">
                                @{alumno.username}
                              </div>
                              <div className="text-xs text-gray-400 truncate">{alumno.email}</div>
                            </td>
                            <td className="p-4 text-gray-600 font-medium truncate">
                              {alumno.nombre} {alumno.apellidos}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(alumno.perfil)}`}
                              >
                                {alumno.perfil}
                              </span>
                              <div className="text-xs text-gray-400 mt-1 truncate">
                                {alumno.profesion}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center">
                                <div
                                  className={`w-3 h-3 rounded-full ${alumno.activo ? "bg-green-500" : "bg-red-500"}`}
                                ></div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setAlumnoSeleccionado(alumno)}
                                className="text-[#40269A] bg-[#DEC7FF]/30 hover:bg-[#C49DFF] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                              >
                                Ver Ficha
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                            No se ha encontrado ningún alumno.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* VISTA VENTAS COMPLETADA CON BUSCADOR Y ORDENACIÓN */}
            {/* ========================================================= */}
            {vistaActiva === "ventas" && (
              <div className="animate-fadeIn">
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
                        <th className="p-4 font-black text-sm uppercase w-[10%] text-right">
                          Acción
                        </th>
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
                            <td className="p-4 font-bold text-[#40269A] truncate">
                              {venta.alumno}
                            </td>
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
                            No se ha encontrado ninguna venta que coincida con "{busqueda}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* VENTANA MODAL 1: FICHA DE ALUMNO (La que ya teníamos) */}
      {/* ========================================================= */}
      {alumnoSeleccionado && (
        <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-8 border-[#C49DFF]">
            <button
              onClick={() => setAlumnoSeleccionado(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
            >
              ✕
            </button>
            <div className="bg-[#fcfaff] p-8 lg:p-10 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[#DEC7FF] text-[#40269A] flex items-center justify-center text-4xl font-black shadow-inner">
                  {alumnoSeleccionado.nombre.charAt(0)}
                  {alumnoSeleccionado.apellidos.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-[#40269A]">
                    {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellidos}
                  </h2>
                  <div className="flex gap-3 mt-3 items-center">
                    <span className="text-[#FF0188] font-bold tracking-wide">
                      @{alumnoSeleccionado.username}
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(alumnoSeleccionado.perfil)}`}
                    >
                      Perfil {alumnoSeleccionado.perfil}
                    </span>
                    {alumnoSeleccionado.activo ? (
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
                  <p className="text-[#40269A] font-bold text-lg">{alumnoSeleccionado.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <p className="text-[#40269A] font-medium text-lg">
                    {alumnoSeleccionado.telefono}
                  </p>
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
                  <p className="text-[#40269A] font-medium text-lg">
                    {alumnoSeleccionado.direccion}
                  </p>
                  <p className="text-gray-500 font-medium">
                    {alumnoSeleccionado.codigoPostal} - {alumnoSeleccionado.ciudad}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Información Profesional
                  </label>
                  <p className="text-[#40269A] font-medium text-lg">
                    {alumnoSeleccionado.esProfesional ? "Profesional" : "Estudiante / Particular"}
                  </p>
                  <p className="text-gray-500 font-medium">
                    {alumnoSeleccionado.profesion || "Sin especificar"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VENTANA MODAL 2: FICHA DE LEAD (Nueva, enfocada a ventas) */}
      {/* ========================================================= */}
      {leadSeleccionado && (
        <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-8 border-[#FF0188]">
            <button
              onClick={() => setLeadSeleccionado(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
            >
              ✕
            </button>

            <div className="bg-[#fcfaff] p-8 lg:p-10 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[#FFDAED] text-[#FF0188] flex items-center justify-center text-4xl font-black shadow-inner">
                  {leadSeleccionado.nombre.charAt(0)}
                  {leadSeleccionado.apellidos.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-[#40269A]">
                    {leadSeleccionado.nombre} {leadSeleccionado.apellidos}
                  </h2>
                  <div className="flex gap-3 mt-3 items-center">
                    <span className="text-gray-500 font-bold tracking-wide bg-gray-100 px-3 py-1 rounded-full text-xs">
                      Entró el {leadSeleccionado.fecha}
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(leadSeleccionado.estado)}`}
                    >
                      Estado: {leadSeleccionado.estado}
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
                  <p className="text-[#40269A] font-bold text-lg">{leadSeleccionado.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <p className="text-[#40269A] font-medium text-lg">{leadSeleccionado.telefono}</p>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-black text-[#FF0188] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
                  Oportunidad de Venta
                </h3>
                <div className="bg-[#FFDAED]/30 p-4 rounded-xl border border-[#FFDAED]">
                  <label className="text-xs font-bold text-[#FF0188] uppercase tracking-wide">
                    Curso en el que está interesado
                  </label>
                  <p className="text-[#40269A] font-black text-xl mt-1">{leadSeleccionado.curso}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 lg:px-10 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
              <button className="text-[#40269A] border-2 border-[#DEC7FF] bg-white px-6 py-3 rounded-xl font-bold hover:bg-[#DEC7FF]/30 transition-colors">
                Marcar como Contactado
              </button>
              <button className="bg-[#FF0188] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#40269A] transition-colors shadow-lg">
                Convertir en Alumno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VENTANA MODAL 3: RECIBO DE VENTA */}
      {/* ========================================================= */}
      {ventaSeleccionada && (
        <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative animate-fadeIn border-t-8 border-[#C49DFF]">
            <button
              onClick={() => setVentaSeleccionada(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
            >
              ✕
            </button>

            <div className="bg-[#fcfaff] p-8 text-center border-b border-gray-100">
              <h2 className="text-2xl font-black text-[#40269A]">Detalle de Transacción</h2>
              <p className="text-gray-400 font-bold mt-1 text-sm">
                ID Venta: #AUM-{ventaSeleccionada.id.toString().padStart(4, "0")}
              </p>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between border-b border-gray-50 pb-4">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">
                  Fecha
                </span>
                <span className="text-[#40269A] font-bold">{ventaSeleccionada.fecha}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-4">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">
                  Alumno
                </span>
                <span className="text-[#40269A] font-bold">{ventaSeleccionada.alumno}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-4">
                <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">
                  Curso Adquirido
                </span>
                <span className="text-[#40269A] font-bold">{ventaSeleccionada.curso}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#C49DFF] font-black uppercase text-sm tracking-widest">
                  Importe Total
                </span>
                <span className="text-[#FF0188] font-black text-3xl">
                  {ventaSeleccionada.importe}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
