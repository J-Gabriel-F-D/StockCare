// components/Saidas/ShowSaida.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saidasService, type Saida } from "../../services/saidasService";
import "./showSaida.css";

const ShowSaida = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saida, setSaida] = useState<Saida | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Carregar dados da saída
  useEffect(() => {
    const carregarSaida = async () => {
      if (!id) return;

      try {
        setCarregando(true);
        const dadosSaida = await saidasService.buscarPorId(id);
        setSaida(dadosSaida);
        setErro("");
      } catch (err) {
        console.error("Erro ao carregar dados da saída:", err);
        setErro("Erro ao carregar dados da saída");
      } finally {
        setCarregando(false);
      }
    };

    carregarSaida();
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

  if (!saida) {
    return (
      <div className="erro-mensagem">{erro || "Saída não encontrada"}</div>
    );
  }

  return (
    <div className="show-saida-container">
      <div className="title">Detalhes da Saída</div>

      <div className="saida-header">
        <button onClick={() => navigate("/saidas")} className="btn-voltar">
          &larr; Voltar
        </button>
      </div>

      <div className="saida-detalhes">
        <div className="form-row">
          <div className="form-group">
            <label>Data e Hora</label>
            <div className="valor">{formatarData(saida.data)}</div>
          </div>

          <div className="form-group">
            <label>Quantidade</label>
            <div className="valor">
              {saida.quantidade} {saida.insumo.unidadeMedida}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Insumo</label>
            <div className="valor">{saida.insumo.nome}</div>
          </div>

          <div className="form-group">
            <label>Destino</label>
            <div className="valor">{saida.destino}</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registrado por</label>
            <div className="valor">
              {saida.usuario.nome} ({saida.usuario.matricula})
            </div>
          </div>

          <div className="form-group">
            <label>Email do responsável</label>
            <div className="valor">{saida.usuario.email}</div>
          </div>
        </div>

        {saida.createdAt && (
          <div className="form-row">
            <div className="form-group">
              <label>Registrado em</label>
              <div className="valor">{formatarData(saida.createdAt)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSaida;
