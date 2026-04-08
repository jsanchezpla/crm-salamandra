"use client";
import { useState } from "react";

const Sidebar = ({ vistaActiva, setVistaActiva, handleLogout }) => {
  // 1. Añadimos un estado para saber si el menú está abierto en el móvil
  const [isOpen, setIsOpen] = useState(false);

  const getMenuClass = (vista) => {
    const baseClass = "block p-4 rounded-2xl font-bold transition-all transform cursor-pointer ";
    if (vistaActiva === vista) {
      return (
        baseClass +
        "bg-brand-light text-white shadow-lg shadow-brand/30 hover:scale-105 font-black"
      );
    }
    return baseClass + "text-brand-muted hover:bg-brand-muted/20 hover:text-brand";
  };

  // 2. Función para cambiar de vista y cerrar el menú en móviles automáticamente
  const handleMenuClick = (vista) => {
    setVistaActiva(vista);
    setIsOpen(false);
  };

  return (
    <>
      {/* BOTÓN HAMBURGUESA (Solo visible en móviles) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-brand text-white rounded-xl shadow-lg hover:bg-brand-light transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* OVERLAY OSCURO PARA MÓVIL (Difumina el fondo cuando el menú está abierto) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-brand/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR PRINCIPAL */}
      {/* Añadimos clases fixed para móvil, static para ordenador, y el translate-x para la animación */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand text-white flex flex-col shadow-2xl shrink-0 h-[100dvh] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* BOTÓN CERRAR (Solo visible en móviles dentro del menú) */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-brand-muted hover:text-brand transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="pt-10 pb-6 text-3xl font-black border-b border-brand-muted/30 tracking-widest text-center font-playpen">
          CRM<span className="text-brand">.</span>
          <a
            href="https://salamandrasolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
          >
            <span className="text-[0.525rem] text-gray-400 font-bold uppercase tracking-widest group-hover:text-gray-500 transition-colors">
              Desarrollado por
            </span>
            <span className="text-[0.725rem] font-black text-gray-300 group-hover:text-brand transition-colors duration-300">
              Salamandra Solutions
            </span>
          </a>
        </div>

        {/* Añadimos overflow-y-auto por si las opciones no caben en pantallas muy pequeñas */}
        <nav className="flex-1 p-6 space-y-3 text-sm tracking-wide overflow-y-auto">
          <div
            onClick={() => handleMenuClick("estadisticas")}
            className={getMenuClass("estadisticas")}
          >
            Inicio
          </div>
          <div onClick={() => handleMenuClick("leads")} className={getMenuClass("leads")}>
            Leads
          </div>
          <div onClick={() => handleMenuClick("alumnos")} className={getMenuClass("alumnos")}>
            Clientes
          </div>
          <div onClick={() => handleMenuClick("ventas")} className={getMenuClass("ventas")}>
            Ventas cursos
          </div>
          <div onClick={() => handleMenuClick("materiales")} className={getMenuClass("materiales")}>
            Ventas material
          </div>
        </nav>

        <div className="p-6 border-t border-brand-muted/30 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full p-4 text-xs font-black text-brand-muted hover:text-white border-2 border-brand-muted hover:bg-brand-muted/20 rounded-2xl transition-all tracking-widest cursor-pointer"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
