"use client";

import React, { useState } from "react";

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nascimento: "",
    longitude: "",
    latitude: "",
    sexo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFormEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
      Nome: formData.name,
      Nascimento: formData.nascimento,
      Sexo: formData.sexo,
      Latitude: parseFloat(formData.latitude),
      Longitude: parseFloat(formData.longitude),
      login: formData.email,
      senha: formData.password,
    };

    console.log("Enviando para a API:", payload);

    try {
      const response = await fetch(
        "https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message || "Erro inesperado ao cadastrar");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        nascimento: "",
        longitude: "",
        latitude: "",
        sexo: "",
      });
    } catch (err: any) {
      setError(err.message || "Erro ao processar o cadastro.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Cadastro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => handleFormEdit(e, "name")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={(e) => handleFormEdit(e, "email")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={(e) => handleFormEdit(e, "password")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="nascimento" className="block text-sm text-gray-600">
              Data de Nascimento
            </label>
            <input
              id="nascimento"
              type="date"
              value={formData.nascimento}
              onChange={(e) => handleFormEdit(e, "nascimento")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm text-gray-600">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) => handleFormEdit(e, "latitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm text-gray-600">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={(e) => handleFormEdit(e, "longitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm text-gray-600">
              Sexo
            </label>
            <select
              id="sexo"
              value={formData.sexo}
              onChange={(e) => handleFormEdit(e, "sexo")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cadastrar
          </button>
          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="mt-4 text-green-600 text-sm text-center">Cadastro realizado com sucesso!</p>}
        </form>
      </div>
    </div>
  );
}
