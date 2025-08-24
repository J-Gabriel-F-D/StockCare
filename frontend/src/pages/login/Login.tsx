// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../../img/logo-stockcare.png";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo/Cabeçalho */}
        <div className="brand-section">
          <div className="brand-text-stock">Stock</div>
          <div className="brand-text-care">Care</div>
        </div>

        <img src={logo} alt="StockCare Logo" className="logo-image" />
        <form onSubmit={handleSubmit} className="forms">
          {error && <div>{error}</div>}

          <div>
            <label className="email-label">E-mail</label>
            <input
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="password-label">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        <div className="to-registration">
          Ainda não possui conta ?{" "}
          <Link to="/usuarios/cadastro" className="registration-link">
            Cadastrar-se
          </Link>
        </div>
      </div>
    </div>
  );
}
