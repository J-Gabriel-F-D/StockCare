// components/Entradas/ShowEntrada.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { entradasService, type Entrada } from "../../services/entradasService";
import "./showEntrada.css";

const ShowEntrada = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Carregar dados da entrada
  useEffect(() => {
    const carregarEntrada = async () => {
      if (!id) return;

      try {
        setCarregando(true);
        const dadosEntrada = await entradasService.buscarPorId(id);
        setEntrada(dadosEntrada);
        setErro("");
      } catch (err) {
        console.error("Erro ao carregar dados da entrada:", err);
        setErro("Erro ao carregar dados da entrada");
      } finally {
        setCarregando(false);
      }
    };

    carregarEntrada();
  }, [id]);

  // Formatar a data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (carregando) {
    return <div className="carregando">Carregando...</div>;
  }

  if (!entrada) {
    return (
      <div className="erro-mensagem">{erro || "Entrada não encontrada"}</div>
    );
  }

  return (
    <div className="show-entrada-container">
      <div className="title">Detalhes da Entrada</div>

      <div className="entrada-header">
        <button onClick={() => navigate("/entradas")} className="btn-voltar">
          &larr; Voltar
        </button>
      </div>

      <div className="entrada-detalhes">
        <div className="form-row">
          <div className="form-group">
            <label>Data e Hora</label>
            <div className="valor">{formatarData(entrada.data)}</div>
          </div>

          <div className="form-group">
            <label>Quantidade</label>
            <div className="valor">
              {entrada.quantidade} {entrada.insumo.unidadeMedida}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Insumo</label>
            <div className="valor">{entrada.insumo.nome}</div>
          </div>

          <div className="form-group">
            <label>Código de Barras</label>
            <div className="valor">{entrada.insumo.codigoBarras || "-"}</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registrado por</label>
            <div className="valor">
              {entrada.usuario.nome} ({entrada.usuario.matricula})
            </div>
          </div>

          <div className="form-group">
            <label>Email do responsável</label>
            <div className="valor">{entrada.usuario.email}</div>
          </div>
        </div>

        {entrada.createdAt && (
          <div className="form-row">
            <div className="form-group">
              <label>Registrado em</label>
              <div className="valor">{formatarData(entrada.createdAt)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowEntrada;
