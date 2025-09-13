// import { Package, Users, FileText, LogOut } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
import boxes from "../../assets/bi_boxes.svg";
import home from "../../assets/ic_baseline-home.svg";
import truck from "../../assets/ri_truck-fill.svg";
import input from "../../assets/ic_round-input.svg";
import output from "../../assets/ic_round-output.svg";
import doc from "../../assets/lsicon_report-filled.svg";

import "./sidebar.css";
import ItemMenu from "../ItemMenu/ItemMenu";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="title-menu">Menu</div>

      <ItemMenu icon={home} link="/" text="Home" />
      <ItemMenu icon={boxes} link="/insumos" text="Insumos" />
      <ItemMenu icon={truck} link="/fornecedores" text="Fornecedores" />
      <ItemMenu icon={doc} link="/relatorios" text="Relatórios" />
      <ItemMenu icon={input} link="/entradas" text="Entradas" />
      <ItemMenu icon={output} link="/saidas" text="Saidas" />
    </div>
  );
}
