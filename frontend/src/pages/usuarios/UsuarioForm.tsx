// src/pages/usuarios/UsuarioForm.tsx
import { useState } from "react";
import { usuariosService } from "../../services/usuariosService";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function UsuarioForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      // 1) Cria usuário
      await usuariosService.criar({
        nome,
        email,
        matricula: Number(matricula),
        cpf,
        senha,
      });

      // 2) Faz login automático
      await login(email, senha);
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cadastro de Usuário
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Já tem conta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Faça login
        </Link>
      </p>
    </div>
  );
}
