"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/service/authService";
import LoginGoogle from "@/components/login/googleLogin";

export default function TelaLogin() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    console.log("Tentando fazer login...");

    try {
      const codigoUsuario = await login(usuario, senha);
      console.log("Código do usuário:", codigoUsuario);

      if (codigoUsuario) {
        localStorage.setItem("usuarioAutenticado", "true");
        router.push("/dadosColetados");
      } else {
        setErro("Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      setErro("Erro ao fazer login.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>

        <div className="mb-4">
          <label htmlFor="usuario" className="block text-sm text-gray-600">
            Usuário
          </label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="senha" className="block text-sm text-gray-600">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Entrar
        </button>

        {erro && <p className="mt-4 text-red-600 text-sm text-center">{erro}</p>}

        <hr className="my-6 border-gray-300" />

        <LoginGoogle />
      </div>
    </div>
  );
}
