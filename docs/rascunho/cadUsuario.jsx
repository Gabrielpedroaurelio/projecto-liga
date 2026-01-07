import React, { useState } from "react";

export default function CadastrarUsuario() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);
      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Cadastrar Usuário</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          placeholder="Nome"
          className="w-full border rounded-lg p-2"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="senha"
          type="password"
          placeholder="Senha"
          className="w-full border rounded-lg p-2"
          value={formData.senha}
          onChange={handleChange}
          required
        />
        <input
          name="cargo"
          placeholder="Cargo"
          className="w-full border rounded-lg p-2"
          value={formData.cargo}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
