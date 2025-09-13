import Card from "../../components/Card/Card";
import "./dashboard.css";
import boxes from "../../assets/branco_boxes.svg";
import truck from "../../assets/branco_truck-fill.svg";
import filled from "../../assets/branco_report-filled.svg";
import input from "../../assets/branco_round-input.svg";
import output from "../../assets/branco_round-output.svg";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="title">Funcionalidades</div>
      <div className="cards-container">
        <Card
          icon={boxes}
          title="Gerenciamento de Insumos"
          btnTrue
          textBtn="Insumos"
          link="/insumos"
        />
        <Card
          icon={truck}
          title="Gerenciamento de Fornecedores"
          btnTrue
          textBtn="Fornecedores"
          link="/fornecedores"
        />
        <Card
          icon={filled}
          title="Relatórios Gerenciais"
          btnTrue
          textBtn="Relatórios"
          link="/relatorios"
        />

        <Card
          icon={input}
          title="Gerenciamento das Entradas"
          btnTrue
          textBtn="Entradas"
          link="/entradas"
        />

        <Card
          icon={output}
          title="Gerenciamento das Saídas"
          btnTrue
          textBtn="Saídas"
          link="/saidas"
        />

        <Card />
      </div>
    </div>
  );
}
