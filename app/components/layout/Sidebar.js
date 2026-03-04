"use client";
const Sidebar = ({ vistaActiva, setVistaActiva, handleLogout }) => {
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

  return (
    <aside className="w-64 bg-[#40269A] text-white flex flex-col shadow-2xl z-10 shrink-0">
      <div className="p-8 text-3xl font-black border-b border-[#C49DFF]/30 tracking-widest text-center font-playpen">
        CRM<span className="text-[#FF0188]">.</span>
      </div>
      <nav className="flex-1 p-6 space-y-4 text-sm tracking-wide">
        <div
          onClick={() => setVistaActiva("estadisticas")}
          className={getMenuClass("estadisticas")}
        >
          Estadísticas
        </div>
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
  );
};

export default Sidebar;
