// components/Fornecedores/ShowFornecedor.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fornecedoresService,
  type Fornecedor,
  type FornecedorInput,
} from "../../services/fornecedoresService";
import "./showFornecedor.css";

const ShowFornecedor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [formData, setFormData] = useState<FornecedorInput>({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
  });

  // Carregar fornecedor pelo ID
  useEffect(() => {
    const carregarFornecedor = async () => {
      if (!id) return;

      try {
        setCarregando(true);
        const dados = await fornecedoresService.buscarPorId(id);
        setFornecedor(dados);
        setFormData({
          nome: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          cnpj: dados.cnpj,
        });
        setErro("");
      } catch (err) {
        setErro("Erro ao carregar fornecedor");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    carregarFornecedor();
  }, [id]);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para salvar as alterações
  const handleSalvar = async () => {
    if (!id) return;

    try {
      setCarregando(true);
      await fornecedoresService.atualizar(id, formData);
      setSucesso("Fornecedor atualizado com sucesso!");
      setEditando(false);

      // Recarregar os dados atualizados
      const dados = await fornecedoresService.buscarPorId(id);
      setFornecedor(dados);
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || "Erro ao atualizar fornecedor");
    } finally {
      setCarregando(false);
    }
  };

  // Função para excluir fornecedor
  const handleExcluir = async () => {
    if (!id) return;

    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      return;
    }

    try {
      setCarregando(true);
      await fornecedoresService.deletar(id);
      setSucesso("Fornecedor excluído com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/fornecedores");
      }, 2000);
    } catch (error: any) {
      setErro(error.response?.data?.mensagem || "Erro ao excluir fornecedor");
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar edição
  const handleCancelarEdicao = () => {
    if (fornecedor) {
      setFormData({
        nome: fornecedor.nome,
        email: fornecedor.email,
        telefone: fornecedor.telefone,
        cnpj: fornecedor.cnpj,
      });
    }
    setEditando(false);
    setErro("");
  };

  if (carregando && !fornecedor) {
    return <div className="carregando">Carregando...</div>;
  }

  if (!fornecedor) {
    return <div className="erro-mensagem">Fornecedor não encontrado</div>;
  }

  return (
    <div className="show-fornecedor-container">
      <div className="title">Visualizar e Editar Fornecedor</div>

      <div className="fornecedor-details">
        <div className="detail-row">
          <label>Nome:</label>
          {editando ? (
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              disabled={carregando}
            />
          ) : (
            <span>{fornecedor.nome}</span>
          )}
        </div>

        <div className="detail-row">
          <label>CNPJ:</label>
          {editando ? (
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleInputChange}
              disabled={carregando}
            />
          ) : (
            <span>{fornecedor.cnpj}</span>
          )}
        </div>

        <div className="detail-row">
          <label>Email:</label>
          {editando ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={carregando}
            />
          ) : (
            <span>{fornecedor.email}</span>
          )}
        </div>

        <div className="detail-row">
          <label>Telefone:</label>
          {editando ? (
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              disabled={carregando}
            />
          ) : (
            <span>{fornecedor.telefone || "-"}</span>
          )}
        </div>

        {erro && <div className="erro-mensagem">{erro}</div>}
        {sucesso && <div className="sucesso-mensagem">{sucesso}</div>}

        <div className="acoes-botoes">
          {editando ? (
            <>
              <button
                onClick={handleSalvar}
                className="btn-salvar"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleCancelarEdicao}
                className="btn-cancelar"
                disabled={carregando}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditando(true)} className="btn-editar">
                Editar
              </button>
              <button
                onClick={handleExcluir}
                className="btn-excluir"
                disabled={carregando}
              >
                Excluir
              </button>
              <button
                onClick={() => navigate("/fornecedores")}
                className="btn-voltar"
              >
                Voltar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowFornecedor;
