"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter(); 
  const pathname = usePathname();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);

  useEffect(() => {
    const autenticarUsuario = localStorage.getItem("usuarioAutenticado");
    setUsuarioAutenticado(autenticarUsuario === "true");
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioAutenticado");
    setUsuarioAutenticado(false);
    router.push("/");
  };

  return (
    <nav className="font-sans flex flex-col sm:flex-row sm:justify-between items-center sm:items-baseline py-4 px-6 bg-transparent text-black shadow w-full">
      <div className="mb-2 sm:mb-0 text-2xl font-bold text-black">
        IoMT
      </div>
      <div className="flex flex-col sm:flex-row mt-4 sm:mt-0">
        <a href="/" className="text-lg no-underline text-black hover:text-[#0040ff] mx-2">
          Home
        </a>
        {usuarioAutenticado ? (
          <>
            <a href="/dadosColetados" className="text-lg no-underline text-black hover:text-[#0040ff] mx-2">
              Dados Coletados
            </a>
            <a href="/dashboard" className="text-lg no-underline text-black hover:text-[#0040ff] mx-2">
              Dashboard
            </a>
            <button onClick={handleLogout} className="text-lg text-red-600 hover:text-red-800 mx-2">
              Sair
            </button>
          </>
        ) : (
          <a href="/login" className="text-lg no-underline text-black hover:text-[#0040ff] mx-2">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
