"use client"
import { getCodigoUsuario, login } from "@/service/authService";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
    <div className="text-white">Carregando...</div>
  </div>
);

function EditProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    password:"",
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
  const searchParams = useSearchParams();

  useEffect(() => {
    const userEmail = searchParams.get("email");
    if (!userEmail) {
      console.error("E-mail do usuário não encontrado na query string.");
      router.push("/login");
      return;
    }
  
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios?email=${userEmail}`,
        );
  
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário.");
        }
  
        const userData = await response.json();
  
        // Filtra o usuário pelo e-mail
        const user = userData.find((u: any) => u.login === userEmail);
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }
  
        setFormData({
          name: user.Nome || "",
          password: user.senha || "",
          email: user.login || "",
          nascimento: user.Nascimento || "",
          longitude: user.Longitude?.toString() || "",
          latitude: user.Latitude?.toString() || "",
          sexo: user.Sexo || "",
          id: user.codigo || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erro ao carregar dados.");
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [router, searchParams]);
  
  const handleFormEdit = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    name: string
  ) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError("");
  
      // Valida o ID
      const userId = parseInt(formData.id, 10);
      if (isNaN(userId)) {
        throw new Error("O ID do usuário é inválido.");
      }
  
      console.log("Dados enviados:", {
        Nome: formData.name,
        senha: formData.password,
        login: formData.email,
        Nascimento: formData.nascimento,
        Sexo: formData.sexo,
        Latitude: parseFloat(formData.latitude),
        Longitude: parseFloat(formData.longitude),
      });
  
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
        throw new Error("Erro ao atualizar dados no servidor.");
      }

      alert("Cadastro atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar cadastro:", err);
      setError(err.message || "Erro ao processar atualização.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://myfastapiapp-v3-668469425698.southamerica-east1.run.app/usuarios/${formData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário.");
      }

      alert("Usuário excluído com sucesso.");
      router.push("/login");
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.message || "Erro ao excluir usuário.");
    }
  };
  if (loading) return <p>Carregando...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={formData.name}
              onChange={(e) => handleFormEdit(e, "name")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-600">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => handleFormEdit(e, "password")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600">E-mail</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nascimento" className="block text-sm text-gray-600">Data de Nascimento</label>
            <input
              id="nascimento"
              type="date"
              value={formData.nascimento}
              onChange={(e) => handleFormEdit(e, "nascimento")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm text-gray-600">Longitude</label>
            <input
              id="longitude"
              type="text"
              value={formData.longitude}
              onChange={(e) => handleFormEdit(e, "longitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm text-gray-600">Latitude</label>
            <input
              id="latitude"
              type="text"
              value={formData.latitude}
              onChange={(e) => handleFormEdit(e, "latitude")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm text-gray-600">Sexo</label>
            <select
              id="sexo"
              value={formData.sexo}
              onChange={(e) => handleFormEdit(e, "sexo")}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="m">Masculino</option>
              <option value="f">Feminino</option>
            </select>
          </div>
          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full p-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditProfile() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditProfileForm />
    </Suspense>
  );
}