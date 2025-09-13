// components/Entradas/Entradas.tsx
import { useCallback, useEffect, useState } from "react";
import "./entradas.css";
import { entradasService, type Entrada } from "../../services/entradasService";
import alert from "../../assets/mdi_alert.svg";
import { useNavigate } from "react-router-dom";

const Entradas = () => {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [entradasFiltradas, setEntradasFiltradas] = useState<Entrada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const navigate = useNavigate();

  // Carregar entradas inicialmente
  useEffect(() => {
    carregarEntradas();
  }, []);

  const carregarEntradas = async () => {
    try {
      setCarregando(true);
      const dados = await entradasService.listar();
      setEntradas(dados);
      setEntradasFiltradas(dados);
      setErro("");
    } catch (err) {
      setErro("Erro ao carregar entradas");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Função para aplicar filtro por data
  const aplicarFiltroData = useCallback(
    (data: string) => {
      if (!data.trim()) {
        setEntradasFiltradas(entradas);
        return;
      }

      try {
        setCarregando(true);
        // Filtragem local por data
        const resultados = entradas.filter((entrada) =>
          entrada.data.includes(data)
        );
        setEntradasFiltradas(resultados);
        setErro("");
      } catch (err) {
        setErro("Erro ao filtrar entradas");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    },
    [entradas]
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
    setEntradasFiltradas(entradas);
  };

  // Formatar a data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const getEntrada = (entrada: Entrada) => {
    return `${entrada.quantidade} ${entrada.insumo.unidadeMedida}`;
  };

  // Atualizada para receber o ID da entrada
  const goingTo = (id: string) => {
    navigate(`/entradas/show/${id}`);
  };

  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <div className="title">Tela de Entradas</div>

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
          onClick={() => navigate("/entradas/registrar")}
          className="btn-registrar"
        >
          Registrar Entrada
        </button>
      </div>

      {erro && <div className="erro-mensagem">{erro}</div>}

      {carregando ? (
        <div className="carregando">Carregando...</div>
      ) : (
        <div className="tabela-entradas">
          {entradasFiltradas.length === 0 ? (
            <div className="sem-resultados">
              <img src={alert} alt="Alerta" />
              {entradas.length === 0
                ? "Nenhuma entrada registrada"
                : "Nenhuma entrada encontrada"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Insumo</th>
                  <th>Quantidade</th>
                  <th>Código de Barras</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entradasFiltradas.map((entrada) => (
                  <tr key={entrada.id}>
                    <td>{formatarData(entrada.data)}</td>
                    <td>{entrada.insumo.nome}</td>
                    <td>{getEntrada(entrada)}</td>
                    <td>{entrada.insumo.codigoBarras || "-"}</td>
                    <td>
                      {/* Botão atualizado para passar o ID */}
                      <button
                        className="table-btn"
                        onClick={() => goingTo(entrada.id)}
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

export default Entradas;
