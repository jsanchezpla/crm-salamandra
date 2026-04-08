import "./globals.css";

// 1. Metadatos de contenido (SEO)
export const metadata = {
  title: "CRM Aumenta | Panel de Control",
  description: "Gestión de leads y clientes de Aumenta",
};

// 2. Metadatos de visualización (Lo que antes daba el aviso)
export const viewport = {
  themeColor: "#3E5C57", // Color de la barra del navegador en móvil
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/glacial-indifference" />
      </head>
      <body
        suppressHydrationWarning
        className="font-glacial antialiased bg-slate-50 text-brand min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
