// components/Entradas/RegistroEntradas.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  entradasService,
  type EntradaInput,
} from "../../services/entradasService";
import { insumosService, type Insumo } from "../../services/insumosService";
import "./registroEntradas.css";

const RegistroEntradas = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [carregandoInsumos, setCarregandoInsumos] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  // Estado para os campos do formulário
  const [formData, setFormData] = useState<EntradaInput>({
    quantidade: 0,
    validade: "",
    insumoId: "",
  });

  // Carregar insumos
  useEffect(() => {
    const carregarInsumos = async () => {
      try {
        setCarregandoInsumos(true);
        const dados = await insumosService.listar();
        setInsumos(dados);
      } catch (err) {
        console.error("Erro ao carregar insumos:", err);
        setErro("Erro ao carregar lista de insumos");
      } finally {
        setCarregandoInsumos(false);
      }
    };

    carregarInsumos();
  }, []);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Converter para número quando necessário
    if (name === "quantidade") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value),
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
    if (!formData.insumoId) {
      setErro("Selecione um insumo");
      return false;
    }

    if (formData.quantidade <= 0) {
      setErro("A quantidade deve ser maior que zero");
      return false;
    }

    // Validação opcional para data de validade
    if (formData.validade) {
      const dataValidade = new Date(formData.validade);
      const hoje = new Date();

      if (dataValidade <= hoje) {
        setErro("A data de validade deve ser futura");
        return false;
      }
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
      await entradasService.criar(formData);
      setSucesso("Entrada registrada com sucesso!");

      // Limpar formulário após sucesso
      setFormData({
        quantidade: 0,
        validade: "",
        insumoId: "",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/entradas");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao registrar entrada:", error);
      setErro(
        error.response?.data?.error ||
          "Erro ao registrar entrada. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    navigate("/entradas");
  };

  // Obter a data mínima para o campo de validade (amanhã)
  const getDataMinima = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split("T")[0];
  };

  return (
    <div className="registro-entradas-container">
      <div className="title">Registro de Entradas</div>

      <form onSubmit={handleSubmit} className="form-entradas">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="insumoId">Insumo *</label>
            <select
              id="insumoId"
              name="insumoId"
              value={formData.insumoId}
              onChange={handleInputChange}
              disabled={carregando || carregandoInsumos}
            >
              <option value="">Selecione um insumo</option>
              {insumos.map((insumo) => (
                <option key={insumo.id} value={insumo.id}>
                  {insumo.nome}{" "}
                  {insumo.codigoBarras && `- ${insumo.codigoBarras}`}
                </option>
              ))}
            </select>
            {carregandoInsumos && (
              <div className="carregando-texto">Carregando insumos...</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade *</label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              value={formData.quantidade || ""}
              onChange={handleInputChange}
              placeholder="0"
              min="1"
              disabled={carregando}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="validade">Data de Validade (Opcional)</label>
          <input
            type="date"
            id="validade"
            name="validade"
            value={formData.validade}
            onChange={handleInputChange}
            min={getDataMinima()}
            disabled={carregando}
          />
          <div className="info-texto">
            Deixe em branco se o insumo não tiver validade
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
            {carregando ? "Registrando..." : "Registrar Entrada"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroEntradas;
