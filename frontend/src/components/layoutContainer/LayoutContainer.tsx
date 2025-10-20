// src/components/Layout.tsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./layoutContainer.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <Sidebar />
      <div className="dashboard-container">
        <Header />
        <main className="main-container">{children}</main>
      </div>
    </div>
  );
}
