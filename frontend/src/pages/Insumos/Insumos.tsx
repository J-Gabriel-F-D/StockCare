// components/Insumos/Insumos.tsx
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./insumos.css";
import { insumosService, type Insumo } from "../../services/insumosService";
import alert from "../../assets/mdi_alert.svg";
import { useNavigate } from "react-router-dom";

const Insumos = () => {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [insumosFiltrados, setInsumosFiltrados] = useState<Insumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modoBusca, setModoBusca] = useState<"normal" | "codigo">("normal");
  const navigate = useNavigate();

  // Carregar insumos inicialmente
  useEffect(() => {
    carregarInsumos();
  }, []);

  const carregarInsumos = async () => {
    try {
      setCarregando(true);
      const dados = await insumosService.listar();
      setInsumos(dados);
      setInsumosFiltrados(dados);
      setErro("");
    } catch (err) {
      setErro("Erro ao carregar insumos");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Função de busca com useCallback para melhor performance
  const handleSearch = useCallback(
    async (termo: string) => {
      if (!termo.trim()) {
        setInsumosFiltrados(insumos);
        setModoBusca("normal");
        return;
      }

      try {
        setCarregando(true);

        // Detectar automaticamente se é uma busca por código
        const isCodigo = /^\d+$/.test(termo);
        setModoBusca(isCodigo ? "codigo" : "normal");

        // Usar a busca inteligente
        const resultados = await insumosService.buscarInteligente(termo);
        setInsumosFiltrados(resultados);
        setErro("");
      } catch (err) {
        setErro("Erro ao buscar insumos");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    },
    [insumos]
  );

  // Função para mudanças em tempo real
  const handleInputChange = useCallback(
    (valor: string) => {
      if (!valor.trim()) {
        setInsumosFiltrados(insumos);
        setModoBusca("normal");
        return;
      }

      // Detectar automaticamente se é uma busca por código
      const isCodigo = /^\d+$/.test(valor);
      setModoBusca(isCodigo ? "codigo" : "normal");

      // Filtragem local para resposta mais rápida
      const termoLower = valor.toLowerCase();
      const resultados = insumos.filter((insumo) => {
        // Priorizar código de barras se for busca numérica
        if (isCodigo && insumo.codigoBarras) {
          return insumo.codigoBarras.includes(valor);
        }

        // Busca geral
        return (
          insumo.nome.toLowerCase().includes(termoLower) ||
          (insumo.codigoBarras &&
            insumo.codigoBarras.toLowerCase().includes(termoLower)) ||
          insumo.id.toLowerCase().includes(termoLower) ||
          (insumo.descricao &&
            insumo.descricao.toLowerCase().includes(termoLower))
        );
      });

      setInsumosFiltrados(resultados);
    },
    [insumos]
  );

  // Função para formatar a exibição do estoque
  const estoque = (insumo: Insumo) => {
    return insumo.quantidadeEmEstoque;
  };

  // Função para determinar a classe CSS baseada no nível de estoque
  const getClasseEstoque = (insumo: Insumo) => {
    if (insumo.quantidadeEmEstoque === undefined) return "estoque-indisponivel";

    if (
      insumo.quantidadeMinima !== undefined &&
      insumo.quantidadeEmEstoque <= insumo.quantidadeMinima
    ) {
      return "estoque-baixo";
    }

    return "estoque-normal";
  };

  const goingTo = (id: string) => {
    console.log(id);

    navigate(`/insumos/show/${id}`);
  };
  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <div className="title">Tela de Insumos</div>
      <SearchBar
        onSearch={handleSearch}
        onInputChange={handleInputChange}
        placeholder="Digite o nome ou código do insumo..."
        debounceDelay={250}
        link="/insumos/cadastro"
        searchBtn="Cadastrar Insumo"
      />

      {erro && <div className="erro-mensagem">{erro}</div>}

      {carregando ? (
        <div className="carregando">Carregando...</div>
      ) : (
        <div className="tabela-insumos">
          {insumosFiltrados.length === 0 ? (
            <div className="sem-resultados">
              <img src={alert} alt="Alerta" />
              {insumos.length === 0
                ? "Nenhum insumo cadastrado"
                : "Nenhum insumo encontrado"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Código de Barras</th>
                  <th>Nome</th>
                  <th>Estoque</th>
                  <th>Unidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {insumosFiltrados.map((insumo) => (
                  <tr key={insumo.id}>
                    <td>{insumo.codigoBarras || "-"}</td>
                    <td>{insumo.nome}</td>
                    <td className={getClasseEstoque(insumo)}>
                      {estoque(insumo)}
                    </td>
                    <td>{insumo.unidadeMedida}</td>
                    <td>
                      <button
                        className="insumos-btn"
                        onClick={() => goingTo(insumo.id)}
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

export default Insumos;
