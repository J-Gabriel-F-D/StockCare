// components/Fornecedores/CadastroFornecedores.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fornecedoresService,
  type FornecedorInput,
} from "../../services/fornecedoresService";
import "./cadastroFornecedores.css";

const CadastroFornecedores = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Estado para os campos do formulário (apenas campos suportados pelo backend)
  const [formData, setFormData] = useState<FornecedorInput>({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
  });

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para validar o formulário
  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("O nome do fornecedor é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      setErro("O email é obrigatório");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErro("Email inválido");
      return false;
    }

    if (!formData.telefone.trim()) {
      setErro("O telefone é obrigatório");
      return false;
    }

    if (!formData.cnpj.trim()) {
      setErro("O CNPJ é obrigatório");
      return false;
    }

    // Validação básica de CNPJ (14 dígitos)
    const cnpjLimpo = formData.cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      setErro("CNPJ deve ter 14 dígitos");
      return false;
    }

    return true;
  };

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);
      await fornecedoresService.criar(formData);
      setSucesso("Fornecedor cadastrado com sucesso!");

      // Limpar formulário após sucesso
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cnpj: "",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/fornecedores");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao cadastrar fornecedor:", error);
      setErro(
        error.response?.data?.mensagem ||
          "Erro ao cadastrar fornecedor. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    navigate("/fornecedores");
  };

  // Função para formatar CNPJ enquanto digita
  const formatarCNPJ = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
    }

    setFormData((prev) => ({
      ...prev,
      cnpj: value,
    }));
  };

  // Função para formatar telefone enquanto digita
  const formatarTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        value = value.replace(/^(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
      }
    }

    setFormData((prev) => ({
      ...prev,
      telefone: value,
    }));
  };

  return (
    <div className="cadastro-fornecedores-container">
      <div className="title">Cadastrar Fornecedor</div>

      <form onSubmit={handleSubmit} className="form-fornecedores">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Nome completo do fornecedor"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cnpj">CNPJ *</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={formatarCNPJ}
              placeholder="00.000.000/0000-00"
              disabled={carregando}
              maxLength={18}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@fornecedor.com"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone *</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={formatarTelefone}
              placeholder="(00) 00000-0000"
              disabled={carregando}
              maxLength={15}
            />
          </div>
        </div>

        {erro && <div className="erro-mensagem">{erro}</div>}
        {sucesso && <div className="sucesso-mensagem">{sucesso}</div>}

        <div className="form-botoes">
          <button
            type="button"
            onClick={handleCancelar}
            className="btn-cancelar"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-salvar" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar Fornecedor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroFornecedores;
