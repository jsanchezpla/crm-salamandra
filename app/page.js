"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("crm_token", data.token);
        localStorage.setItem("crm_email", email);
        router.push("/dashboard");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* --- COLUMNA IZQUIERDA: BRANDING COMPACTO EN MÓVIL --- */}
      {/* En móvil: padding vertical de 8 (py-8). En PC: padding completo de 12 (lg:p-12) */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#40269A] via-[#C49DFF] to-[#FF0188] py-8 px-6 lg:p-12 flex flex-col justify-center lg:justify-between relative overflow-hidden text-white shrink-0 shadow-lg z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF0188]/30 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        {/* En móvil centramos el texto (text-center), en PC a la izquierda (lg:text-left) */}
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-3 lg:mb-10 flex justify-center lg:justify-start">
            {/* Logo más pequeñito en móvil, grande en PC */}
            <Image
              src="/images/logo-aumenta.png"
              alt="Aumenta Logo"
              width={180}
              height={60}
              className="object-contain brightness-0 invert drop-shadow-lg w-[120px] lg:w-[180px]"
            />
          </div>

          {/* El título pasa de text-3xl (móvil) a text-7xl (PC) */}
          <h1 className="font-playpen text-3xl lg:text-7xl font-extrabold leading-tight mb-2 lg:mb-6 drop-shadow-sm">
            Tus clientes, <br className="hidden lg:block" />
            siempre a la vista.
          </h1>

          {/* El subtítulo es más pequeño en móvil y ocupa menos espacio */}
          <p className="font-glacial text-sm lg:text-2xl text-white/90 font-medium max-w-sm mx-auto lg:mx-0">
            Toda tu base de datos organizada, accesible y lista para gestionar.
          </p>
        </div>

        <div className="relative z-10 hidden lg:block">
          <p className="text-sm text-white/70 font-bold tracking-widest">© 2026 AUMENTA</p>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: EL FORMULARIO --- */}
      {/* Se expande para ocupar el espacio restante (flex-1) */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 bg-[#fcfaff]">
        {/* Espaciado reducido entre elementos en móvil (space-y-4) */}
        <div className="w-full max-w-md space-y-4 lg:space-y-8">
          <div className="text-center lg:text-left hidden lg:block">
            <h2 className="text-2xl lg:text-3xl font-black text-[#40269A] mb-2">Hola de nuevo</h2>
            <p className="text-gray-500 font-medium text-sm lg:text-base">
              Introduce tus credenciales para acceder al panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 mt-2 lg:mt-10">
            {error && (
              <div className="p-3 lg:p-4 bg-red-50 border-l-4 border-[#FF0188] text-red-700 text-xs lg:text-sm font-bold rounded-r-xl animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-1 lg:space-y-2">
              <label className="text-xs lg:text-sm font-bold text-[#40269A] tracking-wide ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Menos padding vertical en móvil (py-3) para ahorrar espacio
                className="w-full px-5 py-3 lg:py-4 rounded-xl bg-white border-2 border-gray-100 text-[#40269A] font-bold text-base lg:text-lg outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal"
                placeholder="ejemplo@aumenta.com"
                required
              />
            </div>

            <div className="space-y-1 lg:space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs lg:text-sm font-bold text-[#40269A] tracking-wide">
                  Contraseña
                </label>
                {/* <Link
                  href="/olvide-password"
                  className="text-xs lg:text-sm font-bold text-[#FF0188] hover:underline"
                >
                  ¿Olvidaste la contraseña?
                </Link> */}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 lg:py-4 rounded-xl bg-white border-2 border-gray-100 text-[#40269A] font-bold text-base lg:text-lg outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all duration-300 placeholder:text-gray-300 placeholder:font-normal font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 lg:py-4 px-6 rounded-xl bg-[#FF0188] hover:bg-[#40269A] text-white font-bold text-lg lg:text-xl transition-all duration-300 transform lg:hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-[#C49DFF]/50 disabled:opacity-50"
            >
              {loading ? "Validando..." : "Acceder al Panel →"}
            </button>
          </form>

          <div className="lg:hidden text-center mt-6 text-xs text-gray-400 font-bold">
            © 2026 Centro Aumenta
          </div>
        </div>
      </div>
    </div>
  );
}
