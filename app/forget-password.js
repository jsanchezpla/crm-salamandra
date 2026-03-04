"use client";
import { useState } from "react";
import Link from "next/link";

export default function OlvidePassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);

    try {
      // Aquí llamaremos a la API en el Paso 3
      const res = await fetch("/api/auth/olvide-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(
          "Si el correo existe, te hemos enviado un enlace de recuperación. Revisa tu bandeja de entrada."
        );
        setEmail(""); // Limpiamos el input
      } else {
        setError(data.error || "Ocurrió un error al procesar tu solicitud.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaff] p-6 font-glacial relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C49DFF]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFDAED]/40 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border-t-8 border-[#FF0188] relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-playpen text-3xl font-black text-[#40269A] mb-2">Recuperar Acceso</h1>
          <p className="text-gray-500 font-medium text-sm">
            Introduce tu correo electrónico y te enviaremos instrucciones para crear una nueva
            contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-xl border-l-4 border-[#FF0188]">
              ⚠️ {error}
            </div>
          )}

          {mensaje && (
            <div className="p-4 bg-green-50 text-green-700 text-sm font-bold rounded-xl border-l-4 border-green-500">
              ✅ {mensaje}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#40269A] tracking-wide ml-1">
              Email Profesional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#fcfaff] border-2 border-gray-100 text-[#40269A] font-bold text-lg outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all duration-300 placeholder:text-gray-300"
              placeholder="admin@aumenta.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full py-4 px-6 rounded-xl bg-[#FF0188] hover:bg-[#40269A] text-white font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#C49DFF]/50 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {cargando ? "Enviando enlace..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-[#C49DFF] hover:text-[#40269A] transition-colors"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
