"use client"; // Garantir que o código seja executado no lado do cliente

import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nascimento: "",
    longitude: "",
    latitude: "",
    sexo: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Verifica se o usuário está autenticado e carrega seus dados
  useEffect(() => {
    const userCookie = getCookie("user");
    console.log("Cookie encontrado:", userCookie); // Verifique o conteúdo do cookie

    if (!userCookie) {
      console.log("Usuário não autenticado, redirecionando para login...");
      router.push("/login"); // Redireciona para login se não encontrar o cookie
      return;
    }

    // Carrega os dados do usuário do cookie
    const userData = JSON.parse(userCookie as string);
    console.log("Dados do usuário carregados:", userData); // Verifique se os dados do usuário estão corretos

    setFormData({
      name: userData.Nome || "",
      email: userData.login || "",
      nascimento: userData.Nascimento || "",
      longitude: userData.Longitude?.toString() || "",
      latitude: userData.Latitude?.toString() || "",
      sexo: userData.Sexo || "",
      id: userData.codigo || "",
    });
    setLoading(false);
  }, [router]);

  // Atualiza os campos do formulário
  const handleFormEdit = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string
  ) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  // Envia os dados atualizados
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError("");
      const response = await fetch(
        `https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios/${formData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nome: formData.name,
            login: formData.email,
            Nascimento: formData.nascimento,
            Sexo: formData.sexo,
            Latitude: parseFloat(formData.latitude),
            Longitude: parseFloat(formData.longitude),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar dados no servidor");
      }

      const data = await response.json();
      console.log("Dados atualizados com sucesso:", data);

      alert("Cadastro atualizado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao atualizar cadastro:", err);
      setError(err.message || "Erro ao processar atualização");
    }
  };

  // Excluir o usuário
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios/${formData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário");
      }

      alert("Usuário excluído com sucesso");
      router.push("/login"); // Redireciona para a página de login após a exclusão
    } catch (err: any) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.message || "Erro ao excluir usuário");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              required
              value={formData.name}
              onChange={(e) => handleFormEdit(e, "name")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              value={formData.email}
              onChange={(e) => handleFormEdit(e, "email")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nascimento" className="block text-sm text-gray-600">
              Data de Nascimento
            </label>
            <input
              id="nascimento"
              type="date"
              required
              value={formData.nascimento}
              onChange={(e) => handleFormEdit(e, "nascimento")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              value={formData.longitude}
              onChange={(e) => handleFormEdit(e, "longitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              required
              value={formData.latitude}
              onChange={(e) => handleFormEdit(e, "latitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Atualizar
          </button>

          {/* Botão de excluir */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4"
          >
            Excluir Conta
          </button>

          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
