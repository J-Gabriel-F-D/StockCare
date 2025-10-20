// components/Saidas/RegistroSaidas.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saidasService, type SaidaInput } from "../../services/saidasService";
import { insumosService, type Insumo } from "../../services/insumosService";
import "./registroSaidas.css";

const RegistroSaidas = () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [carregandoInsumos, setCarregandoInsumos] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  // Estado para os campos do formulário
  const [formData, setFormData] = useState<SaidaInput>({
    quantidade: 0,
    destino: "",
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

    if (!formData.destino.trim()) {
      setErro("O destino é obrigatório");
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
      await saidasService.criar(formData);
      setSucesso("Saída registrada com sucesso!");

      // Limpar formulário após sucesso
      setFormData({
        quantidade: 0,
        destino: "",
        insumoId: "",
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/saidas");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao registrar saída:", error);
      setErro(
        error.response?.data?.error ||
          "Erro ao registrar saída. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    navigate("/saidas");
  };

  return (
    <div className="registro-saidas-container">
      <div className="title">Registro de Saídas</div>

      <form onSubmit={handleSubmit} className="form-saidas">
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
          <label htmlFor="destino">Destino *</label>
          <input
            type="text"
            id="destino"
            name="destino"
            value={formData.destino}
            onChange={handleInputChange}
            placeholder="Destino da saída (ex: Setor de Produção)"
            disabled={carregando}
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
            {carregando ? "Registrando..." : "Registrar Saída"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroSaidas;
