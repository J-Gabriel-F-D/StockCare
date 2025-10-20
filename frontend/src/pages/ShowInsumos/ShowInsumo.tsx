// components/Insumos/ShowInsumo.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  insumosService,
  type Insumo,
  type InsumoInput,
} from "../../services/insumosService";
import {
  fornecedoresService,
  type Fornecedor,
} from "../../services/fornecedoresService";
import "./showInsumo.css";

const ShowInsumo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [insumo, setInsumo] = useState<Insumo | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Estado para os campos do formulário de edição
  const [formData, setFormData] = useState<InsumoInput>({
    nome: "",
    descricao: "",
    unidadeMedida: "",
    precoUnitario: 0,
    fornecedorId: "",
    quantidadeMinima: 0,
    codigoBarras: "",
  });

  // Carregar insumo e fornecedores
  useEffect(() => {
    const carregarDados = async () => {
      if (!id) return;

      try {
        setCarregando(true);

        // Carregar insumo
        const dadosInsumo = await insumosService.buscarPorId(id);
        setInsumo(dadosInsumo);
        setFormData({
          nome: dadosInsumo.nome,
          descricao: dadosInsumo.descricao || "",
          unidadeMedida: dadosInsumo.unidadeMedida,
          precoUnitario: dadosInsumo.precoUnitario,
          fornecedorId: dadosInsumo.fornecedorId || "",
          quantidadeMinima: dadosInsumo.quantidadeMinima || 0,
          codigoBarras: dadosInsumo.codigoBarras || "",
        });

        // Carregar fornecedores
        const dadosFornecedores = await fornecedoresService.listar();
        setFornecedores(dadosFornecedores);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Erro ao carregar dados do insumo");
      } finally {
        setCarregando(false);
        setCarregandoFornecedores(false);
      }
    };

    carregarDados();
  }, [id]);

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

  // Função para salvar edição
  const handleSalvarEdicao = async () => {
    if (!id) return;

    try {
      setCarregando(true);
      await insumosService.atualizar(id, formData);
      setSucesso("Insumo atualizado com sucesso!");
      setEditando(false);

      // Recarregar dados do insumo
      const dadosInsumo = await insumosService.buscarPorId(id);
      setInsumo(dadosInsumo);
    } catch (error: any) {
      console.error("Erro ao atualizar insumo:", error);
      setErro(
        error.response?.data?.message ||
          "Erro ao atualizar insumo. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para deletar insumo
  const handleDeletar = async () => {
    if (!id) return;

    if (!window.confirm("Tem certeza que deseja excluir este insumo?")) {
      return;
    }

    try {
      setCarregando(true);
      await insumosService.deletar(id);
      setSucesso("Insumo excluído com sucesso!");

      // Redirecionar após 1 segundo
      setTimeout(() => {
        navigate("/insumos");
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao excluir insumo:", error);
      setErro(
        error.response?.data?.message ||
          "Erro ao excluir insumo. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar edição
  const handleCancelarEdicao = () => {
    if (insumo) {
      setFormData({
        nome: insumo.nome,
        descricao: insumo.descricao || "",
        unidadeMedida: insumo.unidadeMedida,
        precoUnitario: insumo.precoUnitario,
        fornecedorId: insumo.fornecedorId || "",
        quantidadeMinima: insumo.quantidadeMinima || 0,
        codigoBarras: insumo.codigoBarras || "",
      });
    }
    setEditando(false);
    setErro("");
  };

  // Função para determinar a classe CSS baseada no nível de estoque
  const getClasseEstoque = () => {
    if (!insumo || insumo.quantidadeEmEstoque === undefined)
      return "estoque-indisponivel";

    if (
      insumo.quantidadeMinima !== undefined &&
      insumo.quantidadeEmEstoque <= insumo.quantidadeMinima
    ) {
      return "estoque-baixo";
    }

    return "estoque-normal";
  };

  if (carregando) {
    return <div className="carregando">Carregando...</div>;
  }

  if (!insumo) {
    return <div className="erro-mensagem">Insumo não encontrado</div>;
  }

  return (
    <div className="show-insumo-container">
      <div className="title">Visualizar e Editar Insumo</div>

      <div className="insumo-header">
        <button onClick={() => navigate("/insumos")} className="btn-voltar">
          &larr; Voltar
        </button>

        <div className="acoes">
          {!editando ? (
            <>
              <button onClick={() => setEditando(true)} className="btn-editar">
                Editar
              </button>
              <button
                onClick={handleDeletar}
                className="btn-excluir"
                disabled={carregando}
              >
                Excluir
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSalvarEdicao}
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
          )}
        </div>
      </div>

      {erro && <div className="erro-mensagem">{erro}</div>}
      {sucesso && <div className="sucesso-mensagem">{sucesso}</div>}

      <div className="insumo-detalhes">
        <div className="form-row">
          <div className="form-group">
            <label>Nome</label>
            {editando ? (
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                disabled={carregando}
              />
            ) : (
              <div className="valor">{insumo.nome}</div>
            )}
          </div>

          <div className="form-group">
            <label>Código de Barras</label>
            {editando ? (
              <input
                type="text"
                name="codigoBarras"
                value={formData.codigoBarras}
                onChange={handleInputChange}
                disabled={carregando}
              />
            ) : (
              <div className="valor">{insumo.codigoBarras || "-"}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Unidade de Medida</label>
            {editando ? (
              <select
                name="unidadeMedida"
                value={formData.unidadeMedida}
                onChange={handleInputChange}
                disabled={carregando}
              >
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
            ) : (
              <div className="valor">{insumo.unidadeMedida}</div>
            )}
          </div>

          <div className="form-group">
            <label>Preço Unitário</label>
            {editando ? (
              <input
                type="number"
                name="precoUnitario"
                value={formData.precoUnitario}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                disabled={carregando}
              />
            ) : (
              <div className="valor">
                {insumo.precoUnitario.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantidade Mínima</label>
            {editando ? (
              <input
                type="number"
                name="quantidadeMinima"
                value={formData.quantidadeMinima}
                onChange={handleInputChange}
                min="0"
                disabled={carregando}
              />
            ) : (
              <div className="valor">{insumo.quantidadeMinima || 0}</div>
            )}
          </div>

          <div className="form-group">
            <label>Estoque Atual</label>
            <div className={`valor ${getClasseEstoque()}`}>
              {insumo.quantidadeEmEstoque !== undefined
                ? insumo.quantidadeEmEstoque
                : "N/A"}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Fornecedor</label>
          {editando ? (
            <select
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
          ) : (
            <div className="valor">
              {fornecedores.find((f) => f.id === insumo.fornecedorId)?.nome ||
                "Nenhum"}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Descrição</label>
          {editando ? (
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              disabled={carregando}
              rows={3}
            />
          ) : (
            <div className="valor">
              {insumo.descricao || "Nenhuma descrição"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowInsumo;
