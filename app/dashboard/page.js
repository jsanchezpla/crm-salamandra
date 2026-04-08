"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import StudentModal from "../components/dashboard/StudentModal";
import LeadModal from "../components/dashboard/LeadModal";
import SealModal from "../components/dashboard/SealModal";
import VentasView from "../components/dashboard/SealView";
import StudentView from "../components/dashboard/StudentView";
import LeadsView from "../components/dashboard/LeadsView";
import StatsView from "../components/dashboard/StatsView";
import { exportarAExcel } from "@/lib/exportExcel";
import MaterialView from "../components/dashboard/MaterialView";
import MaterialModal from "../components/dashboard/MaterialModal";
import ImportarEmpresaModal from "../components/dashboard/ImportarEmpresaModal";

export default function Dashboard() {
  const router = useRouter();
  const [vistaActiva, setVistaActiva] = useState("estadisticas");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  // --- ESTADOS PARA LA INTERFAZ ---
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenColumna, setOrdenColumna] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtroCursoVentas, setFiltroCursoVentas] = useState("");
  const [filtroMotivoLeads, setFiltroMotivoLeads] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mostrarModalImportar, setMostrarModalImportar] = useState(false);

  const [cargando, setCargando] = useState(
    typeof window !== "undefined" && !localStorage.getItem("crm_token")
  );

  useEffect(() => {
    setBusqueda("");
    setOrdenColumna(null);
    setOrdenAscendente(true);
  }, [vistaActiva]);

  const [leads, setLeads] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [materiales, setMateriales] = useState([]);

  // --- LÓGICA DE PROCESAMIENTO PARA VENTAS ---
  let ventasProcesadas = ventas.filter((v) => {
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      (v.alumno || "").toLowerCase().includes(term) ||
      (v.curso || "").toLowerCase().includes(term) ||
      (v.importe || "").toLowerCase().includes(term) ||
      (v.fecha || "").toLowerCase().includes(term);

    const coincideCursoVenta = filtroCursoVentas === "" || v.curso === filtroCursoVentas;
    return coincideTexto && coincideCursoVenta;
  });

  const cursosUnicosVentas = [...new Set(ventas.map((v) => v.curso).filter(Boolean))];

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
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // --- LÓGICA DE PROCESAMIENTO PARA ALUMNOS ---
  const empresasUnicas = [
    ...new Set(
      alumnos
        .filter((a) => (a.perfil === "Empresa" || a.tipoPerfil === "Empresa") && a.profesion)
        .map((a) => a.profesion)
    ),
  ];

  let alumnosProcesados = alumnos.filter((a) => {
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      a.nombre?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.apellidos?.toLowerCase().includes(term);

    const esEmpresa = a.perfil === "Empresa" || a.tipoPerfil === "Empresa";
    const coincideEmpresa = filtroEmpresa === "" || (esEmpresa && a.profesion === filtroEmpresa);

    return coincideTexto && coincideEmpresa;
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
          vA = (a.perfil || "").toLowerCase();
          vB = (b.perfil || "").toLowerCase();
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
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      (l.nombre || "").toLowerCase().includes(term) ||
      (l.apellidos || "").toLowerCase().includes(term) ||
      (l.email || "").toLowerCase().includes(term) ||
      (l.servicio || "").toLowerCase().includes(term) ||
      (l.curso || "").toLowerCase().includes(term) ||
      (l.mensaje || "").toLowerCase().includes(term);

    const coincideMotivo = filtroMotivoLeads === "" || l.motivo === filtroMotivoLeads;
    return coincideTexto && coincideMotivo;
  });

  if (ordenColumna && vistaActiva === "leads") {
    leadsProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "nombre":
          vA = a.nombre.toLowerCase();
          vB = b.nombre.toLowerCase();
          break;
        case "motivo":
          vA = (a.motivo || "").toLowerCase();
          vB = (b.motivo || "").toLowerCase();
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

  // --- LÓGICA DE PROCESAMIENTO PARA MATERIALES ---
  const listadoMateriales = materiales || [];
  const categoriasUnicas = [...new Set(listadoMateriales.map((m) => m.categoria).filter(Boolean))];

  let materialesProcesados = listadoMateriales.filter((m) => {
    const term = (busqueda || "").toLowerCase();
    const nombreDelAlumno = m.alumno?.nombre || m.alumnoNombre || "";

    const coincideTexto =
      (m.nombreMaterial || "").toLowerCase().includes(term) ||
      (m.categoria || "").toLowerCase().includes(term) ||
      nombreDelAlumno.toLowerCase().includes(term) ||
      (m.precio?.toString() || "").includes(term);

    const coincideCategoria = filtroCategoria === "" || m.categoria === filtroCategoria;
    return coincideTexto && coincideCategoria;
  });

  if (ordenColumna && vistaActiva === "materiales") {
    materialesProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "nombreMaterial":
          vA = (a.nombreMaterial || "").toLowerCase();
          vB = (b.nombreMaterial || "").toLowerCase();
          break;
        case "categoria":
          vA = (a.categoria || "").toLowerCase();
          vB = (b.categoria || "").toLowerCase();
          break;
        case "alumnoNombre":
          vA = (a.alumno?.nombre || a.alumnoNombre || "").toLowerCase();
          vB = (b.alumno?.nombre || b.alumnoNombre || "").toLowerCase();
          break;
        case "precio":
          vA = Number(a.precio || 0);
          vB = Number(b.precio || 0);
          break;
        case "fechaCompra":
          vA = new Date(a.fechaCompra).getTime();
          vB = new Date(b.fechaCompra).getTime();
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  const handleUpdateEstado = async (id, nuevoEstado) => {
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, estado: nuevoEstado } : lead)));
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!response.ok) {
        console.error("Error al guardar en la base de datos");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

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
      <span className="text-brand ml-1">↑</span>
    ) : (
      <span className="text-brand ml-1">↓</span>
    );
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("crm_token");
      const emailGuardado = localStorage.getItem("crm_email");

      if (!token) {
        router.push("/");
        return;
      }
      if (emailGuardado) setUsuarioEmail(emailGuardado);

      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads);
          setAlumnos(data.alumnos);
          setVentas(data.ventas);
          setMateriales(data.materiales);
        } else {
          if (res.status === 401) {
            localStorage.removeItem("crm_token");
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error cargando la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_email");
    router.push("/");
  };

  if (cargando)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-brand font-bold text-xl animate-pulse">
        Cargando tu espacio Aumenta...
      </div>
    );

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "Nuevo":
        return "bg-brand-subtle text-brand border border-brand/20";
      case "Contactado":
        return "bg-brand-border text-brand border border-brand/20";
      case "Empresa":
        return "bg-blue-100 text-blue-700";
      case "Privado":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-surface flex font-glacial relative">
      <Sidebar
        vistaActiva={vistaActiva}
        setVistaActiva={setVistaActiva}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* MAGIA RESPONSIVA EN LA CABECERA */}
        <header className="bg-white py-5 px-4 pl-16 md:p-8 md:pl-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 z-0 shrink-0 border-b border-gray-100">
          <h1 className="text-xl md:text-3xl font-black text-brand tracking-tight">
            {vistaActiva === "estadisticas" && "Análisis y Rendimiento"}
            {vistaActiva === "leads" && "Gestión de Prospectos"}
            {vistaActiva === "alumnos" && "Directorio de Alumnos"}
            {vistaActiva === "ventas" && "Historial de Ventas"}
            {vistaActiva === "materiales" && "Ventas de Materiales"}
          </h1>
          <div className="text-xs md:text-sm font-bold text-brand bg-brand-border/30 px-4 py-2 md:px-6 md:py-3 rounded-full border border-brand-muted/50 max-w-full truncate">
            {usuarioEmail || "Cargando..."}
          </div>
        </header>

        {/* MAGIA RESPONSIVA EN EL CONTENEDOR PRINCIPAL */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto bg-gradient-to-br from-surface to-brand-border/10">
          <div className="bg-white p-5 md:p-8 lg:p-12 rounded-[2rem] shadow-xl border-t-[8px] border-brand-subtle min-h-full relative overflow-x-hidden">
            {vistaActiva === "estadisticas" && (
              <StatsView leads={leads} alumnos={alumnos} ventas={ventas} />
            )}

            {vistaActiva === "leads" && (
              <LeadsView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                leadsProcesados={leadsProcesados}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setLeadSeleccionado={setLeadSeleccionado}
                getBadgeColor={getBadgeColor}
                filtroMotivo={filtroMotivoLeads}
                setFiltroMotivo={setFiltroMotivoLeads}
                onExportar={() => exportarAExcel(leadsProcesados, "Leads_Aumenta", "leads")}
              />
            )}

            {vistaActiva === "alumnos" && (
              <StudentView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                alumnosProcesados={alumnosProcesados}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setAlumnoSeleccionado={setAlumnoSeleccionado}
                getBadgeColor={getBadgeColor}
                filtroEmpresa={filtroEmpresa}
                setFiltroEmpresa={setFiltroEmpresa}
                empresasUnicas={empresasUnicas}
                onExportar={() => exportarAExcel(alumnosProcesados, "Alumnos_Aumenta", "alumnos")}
                setMostrarModalImportar={setMostrarModalImportar}
              />
            )}

            {vistaActiva === "ventas" && (
              <VentasView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                ventasProcesadas={ventasProcesadas}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setVentaSeleccionada={setVentaSeleccionada}
                filtroCurso={filtroCursoVentas}
                setFiltroCurso={setFiltroCursoVentas}
                cursosUnicos={cursosUnicosVentas}
                onExportar={() => exportarAExcel(ventasProcesadas, "Ventas_Aumenta", "ventas")}
              />
            )}

            {vistaActiva === "materiales" && (
              <MaterialView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                materialesProcesados={materialesProcesados}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setMaterialSeleccionado={setMaterialSeleccionado}
                filtroCategoria={filtroCategoria}
                setFiltroCategoria={setFiltroCategoria}
                categoriasUnicas={categoriasUnicas}
                onExportar={() =>
                  exportarAExcel(materialesProcesados, "Materiales_Aumenta", "materiales")
                }
              />
            )}
          </div>
        </div>
      </main>

      {/* MODALES */}
      <StudentModal
        alumno={alumnoSeleccionado}
        onClose={() => setAlumnoSeleccionado(null)}
        getBadgeColor={getBadgeColor}
      />

      <LeadModal
        lead={leadSeleccionado}
        onClose={() => setLeadSeleccionado(null)}
        getBadgeColor={getBadgeColor}
        onUpdateEstado={handleUpdateEstado}
      />

      <SealModal seal={ventaSeleccionada} onClose={() => setVentaSeleccionada(null)} />

      <MaterialModal
        material={materialSeleccionado}
        onClose={() => setMaterialSeleccionado(null)}
      />

      {mostrarModalImportar && (
        <ImportarEmpresaModal
          empresasExistentes={empresasUnicas}
          onClose={() => setMostrarModalImportar(false)}
          onImportarExito={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
