// components/Saidas/Saidas.tsx
import { useCallback, useEffect, useState } from "react";
import "./saidas.css";
import { saidasService, type Saida } from "../../services/saidasService";
import { useNavigate } from "react-router-dom";
import alert from "../../assets/mdi_alert.svg";

const Saidas = () => {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [saidasFiltradas, setSaidasFiltradas] = useState<Saida[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const navigate = useNavigate();

  // Carregar saídas inicialmente
  useEffect(() => {
    carregarSaidas();
  }, []);

  const carregarSaidas = async () => {
    try {
      setCarregando(true);
      const dados = await saidasService.listar();
      setSaidas(dados);
      setSaidasFiltradas(dados);
      setErro("");
    } catch (err) {
      setErro("Erro ao carregar saídas");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Função para aplicar filtro por data
  const aplicarFiltroData = useCallback(
    (data: string) => {
      if (!data.trim()) {
        setSaidasFiltradas(saidas);
        return;
      }

      try {
        setCarregando(true);
        // Filtragem local por data
        const resultados = saidas.filter((saida) => saida.data.includes(data));
        setSaidasFiltradas(resultados);
        setErro("");
      } catch (err) {
        setErro("Erro ao filtrar saídas");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    },
    [saidas]
  );

  // Função para lidar com mudanças no input de data
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.value;
    setDataFiltro(data);
    aplicarFiltroData(data);
  };

  // Função para limpar o filtro
  const limparFiltro = () => {
    setDataFiltro("");
    setSaidasFiltradas(saidas);
  };

  // Formatar a data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const getSaida = (saida: Saida) => {
    return `${saida.quantidade} ${saida.insumo.unidadeMedida}`;
  };

  // Atualizada para receber o ID da saída
  const goingTo = (id: string) => {
    navigate(`/saidas/show/${id}`);
  };

  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <div className="title">Tela de Saídas</div>

      <div className="filtro-container">
        <div className="filtro-data">
          <label htmlFor="dataFiltro">Filtrar por data:</label>
          <input
            type="date"
            id="dataFiltro"
            value={dataFiltro}
            onChange={handleDataChange}
            className="input-data"
          />
          <button
            onClick={limparFiltro}
            className="btn-limpar"
            disabled={!dataFiltro}
          >
            Limpar
          </button>
        </div>

        <button
          onClick={() => navigate("/saidas/registrar")}
          className="btn-registrar"
        >
          Registrar Saída
        </button>
      </div>

      {erro && <div className="erro-mensagem">{erro}</div>}

      {carregando ? (
        <div className="carregando">Carregando...</div>
      ) : (
        <div className="tabela-saidas">
          {saidasFiltradas.length === 0 ? (
            <div className="sem-resultados">
              <img src={alert} alt="Alerta" />
              {saidas.length === 0
                ? "Nenhuma saída registrada"
                : "Nenhuma saída encontrada"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Insumo</th>
                  <th>Quantidade</th>
                  <th>Destino</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {saidasFiltradas.map((saida) => (
                  <tr key={saida.id}>
                    <td>{formatarData(saida.data)}</td>
                    <td>{saida.insumo.nome}</td>
                    <td>{getSaida(saida)}</td>
                    <td>{saida.destino}</td>
                    <td>
                      {/* Botão atualizado para passar o ID */}
                      <button
                        className="table-btn"
                        onClick={() => goingTo(saida.id)}
                      >
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Saidas;
