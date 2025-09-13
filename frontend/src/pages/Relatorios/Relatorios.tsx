// components/Relatorios/Relatorios.tsx
import React, { useState, useEffect } from "react";
import { relatoriosService } from "../../services/relatoriosService";
import type {
  MovimentacaoRelatorio,
  InsumoCritico,
  ItemInventario,
  FiltrosRelatorio,
} from "../../services/relatoriosService";
import "./relatorios.css";

type TipoRelatorio = "movimentacoes" | "insumos-criticos" | "inventario";

const Relatorios: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<TipoRelatorio>("movimentacoes");
  const [dados, setDados] = useState<
    MovimentacaoRelatorio[] | InsumoCritico[] | ItemInventario[]
  >([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Filtros para movimentações
  const [filtrosMovimentacoes, setFiltrosMovimentacoes] =
    useState<FiltrosRelatorio>({
      tipo: "",
      codigoBarras: "",
      inicio: "",
      fim: "",
      destino: "",
    });

  // Filtro para insumos críticos
  const [filtroCodigoBarras, setFiltroCodigoBarras] = useState("");

  useEffect(() => {
    carregarDados();
  }, [abaAtiva, filtrosMovimentacoes, filtroCodigoBarras]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro("");

    try {
      switch (abaAtiva) {
        case "movimentacoes":
          const movimentacoes = await relatoriosService.getMovimentacoes(
            filtrosMovimentacoes
          );
          setDados(movimentacoes);
          break;
        case "insumos-criticos":
          const insumosCriticos = await relatoriosService.getInsumosCriticos(
            filtroCodigoBarras || undefined
          );
          setDados(insumosCriticos);
          break;
        case "inventario":
          const inventario = await relatoriosService.getInventario();
          setDados(inventario);
          break;
      }
    } catch (error) {
      setErro("Erro ao carregar dados do relatório");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleExportar = async (formato: "xlsx" | "pdf") => {
    try {
      let blob: Blob;
      let nomeArquivo: string;

      switch (abaAtiva) {
        case "movimentacoes":
          blob = await relatoriosService.exportMovimentacoes({
            ...filtrosMovimentacoes,
            formato,
          });
          nomeArquivo = `relatorio_movimentacoes.${formato}`;
          break;
        case "insumos-criticos":
          blob = await relatoriosService.exportInsumosCriticos(
            formato,
            filtroCodigoBarras || undefined
          );
          nomeArquivo = `relatorio_insumos_criticos.${formato}`;
          break;
        case "inventario":
          blob = await relatoriosService.exportInventario(formato);
          nomeArquivo = `relatorio_inventario.${formato}`;
          break;
        default:
          return;
      }

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErro("Erro ao exportar relatório");
      console.error(error);
    }
  };

  const renderFiltros = () => {
    switch (abaAtiva) {
      case "movimentacoes":
        return (
          <div className="filtros">
            <div className="filtro-group">
              <label>Tipo:</label>
              <select
                className="select-div"
                value={filtrosMovimentacoes.tipo}
                onChange={(e) =>
                  setFiltrosMovimentacoes({
                    ...filtrosMovimentacoes,
                    tipo: e.target.value,
                  })
                }
              >
                <option className="options-select" value="">
                  Todos
                </option>
                <option className="options-select" value="entrada">
                  Entrada
                </option>
                <option className="options-select" value="saida">
                  Saída
                </option>
              </select>
            </div>

            <div className="filtro-group">
              <label>Código de Barras:</label>
              <input
                type="text"
                value={filtrosMovimentacoes.codigoBarras || ""}
                onChange={(e) =>
                  setFiltrosMovimentacoes({
                    ...filtrosMovimentacoes,
                    codigoBarras: e.target.value,
                  })
                }
                placeholder="Filtrar por código de barras"
              />
            </div>

            <div className="filtro-group">
              <label>Data início:</label>
              <input
                type="date"
                value={filtrosMovimentacoes.inicio || ""}
                onChange={(e) =>
                  setFiltrosMovimentacoes({
                    ...filtrosMovimentacoes,
                    inicio: e.target.value,
                  })
                }
              />
            </div>

            <div className="filtro-group">
              <label>Data fim:</label>
              <input
                type="date"
                value={filtrosMovimentacoes.fim || ""}
                onChange={(e) =>
                  setFiltrosMovimentacoes({
                    ...filtrosMovimentacoes,
                    fim: e.target.value,
                  })
                }
              />
            </div>

            <div className="filtro-group">
              <label>Destino:</label>
              <input
                type="text"
                value={filtrosMovimentacoes.destino || ""}
                onChange={(e) =>
                  setFiltrosMovimentacoes({
                    ...filtrosMovimentacoes,
                    destino: e.target.value,
                  })
                }
                placeholder="Filtrar por destino"
              />
            </div>
          </div>
        );

      case "insumos-criticos":
        return (
          <div className="filtros">
            <div className="filtro-group">
              <label>Filtrar por código de barras:</label>
              <input
                type="text"
                value={filtroCodigoBarras}
                onChange={(e) => setFiltroCodigoBarras(e.target.value)}
                placeholder="Código de barras do insumo"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTabela = () => {
    if (carregando) return <div className="carregando">Carregando...</div>;
    if (erro) return <div className="erro">{erro}</div>;
    if (dados.length === 0)
      return <div className="sem-dados">Nenhum dado encontrado</div>;

    switch (abaAtiva) {
      case "movimentacoes":
        return (
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Insumo</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Destino</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {(dados as MovimentacaoRelatorio[]).map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                  <td>{item.tipo}</td>
                  <td>{item.insumo}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.unidadeMedida}</td>
                  <td>{item.destino}</td>
                  <td>{item.fornecedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "insumos-criticos":
        return (
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Unidade</th>
                <th>Quantidade Atual</th>
                <th>Quantidade Mínima</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {(dados as InsumoCritico[]).map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>{item.unidade}</td>
                  <td className={item.atual < item.minimo ? "critico" : ""}>
                    {item.atual}
                  </td>
                  <td>{item.minimo}</td>
                  <td>{item.fornecedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "inventario":
        return (
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Unidade</th>
                <th>Quantidade Atual</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {(dados as ItemInventario[]).map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.unidade}</td>
                  <td>{item.quantidadeAtual}</td>
                  <td>{item.fornecedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="relatorios-container">
      <div className="title">Tela de Relatórios</div>

      <div className="abas">
        <button
          className={abaAtiva === "movimentacoes" ? "ativa" : ""}
          onClick={() => setAbaAtiva("movimentacoes")}
        >
          Movimentações
        </button>
        <button
          className={abaAtiva === "insumos-criticos" ? "ativa" : ""}
          onClick={() => setAbaAtiva("insumos-criticos")}
        >
          Insumos Críticos
        </button>
        <button
          className={abaAtiva === "inventario" ? "ativa" : ""}
          onClick={() => setAbaAtiva("inventario")}
        >
          Inventário
        </button>
      </div>

      <div className="filtros-container">
        <h3>Filtros</h3>
        {renderFiltros()}
      </div>

      <div className="visualizacao-container">
        <h3>Visualização do Relatório</h3>
        <div className="visualizacao">{renderTabela()}</div>
      </div>

      <div className="exportar-container">
        <h3>Exportar Relatório</h3>
        <div className="botoes-exportar">
          <button
            onClick={() => handleExportar("xlsx")}
            className="botao-exportar"
          >
            Exportar para Excel
          </button>
          <button
            onClick={() => handleExportar("pdf")}
            className="botao-exportar"
          >
            Exportar para PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
