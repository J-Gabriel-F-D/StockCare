// components/Insumos/CadastroInsumos.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  insumosService,
  type InsumoInput,
} from "../../services/insumosService";
import {
  fornecedoresService,
  type Fornecedor,
} from "../../services/fornecedoresService";
import "./cadastroInsumos.css";

const CadastroInsumos = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  // Estado para os campos do formulário
  const [formData, setFormData] = useState<InsumoInput>({
    nome: "",
    descricao: "",
    unidadeMedida: "",
    precoUnitario: 0,
    fornecedorId: "",
    quantidadeMinima: 0,
    codigoBarras: "",
  });

  // Carregar fornecedores
  useEffect(() => {
    const carregarFornecedores = async () => {
      try {
        setCarregandoFornecedores(true);
        const dados = await fornecedoresService.listar();
        setFornecedores(dados);
      } catch (err) {
        console.error("Erro ao carregar fornecedores:", err);
      } finally {
        setCarregandoFornecedores(false);
      }
    };

    carregarFornecedores();
  }, []);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Converter para número quando necessário
    if (name === "precoUnitario" || name === "quantidadeMinima") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Função para validar o formulário
  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("O nome do insumo é obrigatório");
      return false;
    }

    if (!formData.unidadeMedida.trim()) {
      setErro("A unidade de medida é obrigatória");
      return false;
    }

    if (formData.precoUnitario <= 0) {
      setErro("O preço unitário deve ser maior que zero");
      return false;
    }

    if ((formData.quantidadeMinima ?? 0) < 0) {
      setErro("A quantidade mínima não pode ser negativa");
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
      await insumosService.criar(formData);
      setSucesso("Insumo cadastrado com sucesso!");

      // Limpar formulário após sucesso
      setFormData({
        nome: "",
        descricao: "",
        unidadeMedida: "",
        precoUnitario: 0,
        fornecedorId: "",
        quantidadeMinima: 0,
        codigoBarras: "",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/insumos");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao cadastrar insumo:", error);
      setErro(
        error.response?.data?.message ||
          "Erro ao cadastrar insumo. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    navigate("/insumos");
  };

  return (
    <div className="cadastro-insumos-container">
      <div className="title">Cadastrar Insumo</div>

      <form onSubmit={handleSubmit} className="form-insumos">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Nome do insumo"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="unidadeMedida">Unidade de Medida *</label>
            <select
              id="unidadeMedida"
              name="unidadeMedida"
              value={formData.unidadeMedida}
              onChange={handleInputChange}
              disabled={carregando}
            >
              <option value="">Selecione uma unidade</option>
              <option value="UN">UN - Unidade</option>
              <option value="KG">KG - Quilograma</option>
              <option value="G">G - Grama</option>
              <option value="L">L - Litro</option>
              <option value="ML">ML - Mililitro</option>
              <option value="M">M - Metro</option>
              <option value="CM">CM - Centímetro</option>
              <option value="CX">CX - Caixa</option>
              <option value="PC">PC - Pacote</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precoUnitario">Preço Unitário *</label>
            <input
              type="number"
              id="precoUnitario"
              name="precoUnitario"
              value={formData.precoUnitario || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidadeMinima">Quantidade Mínima</label>
            <input
              type="number"
              id="quantidadeMinima"
              name="quantidadeMinima"
              value={formData.quantidadeMinima || ""}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              disabled={carregando}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="codigoBarras">Código de Barras</label>
            <input
              type="text"
              id="codigoBarras"
              name="codigoBarras"
              value={formData.codigoBarras}
              onChange={handleInputChange}
              placeholder="Código de barras do insumo"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fornecedorId">Fornecedor</label>
            <select
              id="fornecedorId"
              name="fornecedorId"
              value={formData.fornecedorId}
              onChange={handleInputChange}
              disabled={carregando || carregandoFornecedores}
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
            {carregandoFornecedores && (
              <div className="carregando-texto">Carregando fornecedores...</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Descrição do insumo"
            disabled={carregando}
            rows={3}
          />
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
            {carregando ? "Cadastrando..." : "Cadastrar Insumo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroInsumos;
