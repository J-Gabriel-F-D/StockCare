// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../../img/logo-stockcare.png";
import { useAlert } from "../../hooks/useAlertHook";
import Alert from "../../components/Alert/Alert";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { alert, error: showError, hideAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch (err) {
      const errorMessage =
        "Credenciais inválidas. Verifique seu e-mail e senha.";
      setError(errorMessage);
      showError("Erro no login", errorMessage);
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
          {/* Exiba o erro localmente se desejar */}
          {error && (
            <Alert
              isOpen={alert.isOpen}
              onClose={hideAlert}
              title={alert.title}
              message={alert.message}
              type={alert.type}
              duration={5000}
            />
          )}

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
          Ainda não possui conta?{" "}
          <Link to="/usuarios/cadastro" className="registration-link">
            Cadastrar-se
          </Link>
        </div>
      </div>

      {/* Componente de Alerta */}
      <Alert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        duration={5000} // Fecha automaticamente após 5 segundos
      />
    </div>
  );
}
