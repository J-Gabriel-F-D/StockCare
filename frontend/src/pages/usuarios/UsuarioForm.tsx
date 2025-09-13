// src/pages/usuarios/UsuarioForm.tsx
import { useState } from "react";
import { usuariosService } from "../../services/usuariosService";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./usarioForm.css";
import { useAlert } from "../../hooks/useAlertHook";
import Alert from "../../components/Alert/Alert";

export default function UsuarioForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { alert, error: showError, hideAlert } = useAlert();

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
      const errorMessage = "Erro ao cadastrar usuário";
      setError(errorMessage);
      showError("Erro no login", errorMessage);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="brand-header">
          <div className="brand-text-stock">Stock</div>
          <div className="brand-text-care">Care</div>
        </div>
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

        <form onSubmit={handleSubmit} className="forms">
          <div>
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <div className="form-label">Nome</div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                  <div className="form-label">Matricula</div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Matricula"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                  />
                  <div className="form-label">Senha</div>
                  <input
                    type="password"
                    placeholder="Senha"
                    className="form-input"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <div className="form-label">E-mail</div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="form-label">CPF</div>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                  <div className="form-label">Confirmar Senha</div>
                  <input
                    type="password"
                    placeholder="Confirmar Senha"
                    className="form-input"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Cadastrar
          </button>
        </form>

        <div className="to-login">
          Já tem conta?{" "}
          <Link to="/login" className="login-link">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
