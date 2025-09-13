// components/Fornecedores/Fornecedores.tsx
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./fornecedores.css";
import {
  fornecedoresService,
  type Fornecedor,
} from "../../services/fornecedoresService";
import alert from "../../assets/mdi_alert.svg";
import { useNavigate } from "react-router-dom";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState<
    Fornecedor[]
  >([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Carregar fornecedores inicialmente
  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      setCarregando(true);
      const dados = await fornecedoresService.listar();
      setFornecedores(dados);
      setFornecedoresFiltrados(dados);
      setErro("");
    } catch (err) {
      setErro("Erro ao carregar fornecedores");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  // Função de busca com useCallback para melhor performance
  const handleSearch = useCallback(
    async (termo: string) => {
      if (!termo.trim()) {
        setFornecedoresFiltrados(fornecedores);
        return;
      }

      try {
        setCarregando(true);
        const resultados = await fornecedoresService.buscarInteligente(termo);
        setFornecedoresFiltrados(resultados);
        setErro("");
      } catch (err) {
        setErro("Erro ao buscar fornecedores");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    },
    [fornecedores]
  );

  // Função para mudanças em tempo real
  const handleInputChange = useCallback(
    (valor: string) => {
      if (!valor.trim()) {
        setFornecedoresFiltrados(fornecedores);
        return;
      }

      // Filtragem local para resposta mais rápida
      const termoLower = valor.toLowerCase();
      const resultados = fornecedores.filter((fornecedor) => {
        return (
          fornecedor.nome.toLowerCase().includes(termoLower) ||
          fornecedor.cnpj.toLowerCase().includes(termoLower) ||
          fornecedor.email.toLowerCase().includes(termoLower) ||
          (fornecedor.contato &&
            fornecedor.contato.toLowerCase().includes(termoLower)) ||
          fornecedor.id.toLowerCase().includes(termoLower)
        );
      });

      setFornecedoresFiltrados(resultados);
    },
    [fornecedores]
  );

  const goingTo = (id: string) => {
    navigate(`/fornecedores/show/${id}`);
  };

  return (
    <div style={{ width: "100%", height: "60vh" }}>
      <div className="title">Tela de Fornecedores</div>
      <SearchBar
        link="/fornecedores/cadastrar"
        searchBtn="Cadastrar fornecedor"
        onSearch={handleSearch}
        onInputChange={handleInputChange}
        placeholder="Digite o nome, CNPJ ou email do fornecedor..."
        debounceDelay={250}
      />

      {erro && <div className="erro-mensagem">{erro}</div>}

      {carregando ? (
        <div className="carregando">Carregando...</div>
      ) : (
        <div className="tabela-fornecedores">
          {fornecedoresFiltrados.length === 0 ? (
            <div className="sem-resultados">
              <img src={alert} alt="Alerta" />
              {fornecedores.length === 0
                ? "Nenhum fornecedor cadastrado"
                : "Nenhum fornecedor encontrado"}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedoresFiltrados.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.nome}</td>
                    <td>{fornecedor.cnpj}</td>
                    <td>{fornecedor.email}</td>
                    <td>{fornecedor.telefone || "-"}</td>
                    <td>
                      <button
                        className="fornecedores-btn"
                        onClick={() => goingTo(fornecedor.id)}
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

export default Fornecedores;
