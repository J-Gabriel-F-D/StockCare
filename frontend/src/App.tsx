// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/layoutContainer/LayoutContainer";
import UsuarioForm from "./pages/usuarios/UsuarioForm";
import Insumos from "./pages/Insumos/Insumos";
import Fornecedores from "./pages/Fornecedores/Fornecedores";
import Relatorios from "./pages/Relatorios/Relatorios";
import Saidas from "./pages/Saidas/Saidas";
import Entradas from "./pages/Entradas/Entradas";
import CadastroFornecedores from "./pages/CadastroFornecedores/CadastroFornecedores";
import CadastroInsumos from "./pages/CadastroInsumos/CadastroInsumos";
import RegistroSaidas from "./pages/RegistroSaidas/RegistroSaidas";
import RegistroEntradas from "./pages/RegistroEntradas/RegistroEntradas";
import ShowFornecedor from "./pages/Showfornecedor/ShowFornecedor";
import ShowInsumo from "./pages/ShowInsumos/ShowInsumo";
import ShowSaida from "./pages/ShowSaida/ShowSaida";
import ShowEntrada from "./pages/ShowEntrada/ShowEntrada";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/usuarios/cadastro" element={<UsuarioForm />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/insumos"
            element={
              <PrivateRoute>
                <Layout>
                  <Insumos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores"
            element={
              <PrivateRoute>
                <Layout>
                  <Fornecedores />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Layout>
                  <Relatorios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saidas"
            element={
              <PrivateRoute>
                <Layout>
                  <Saidas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/entradas"
            element={
              <PrivateRoute>
                <Layout>
                  <Entradas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores/cadastrar"
            element={
              <PrivateRoute>
                <Layout>
                  <CadastroFornecedores />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/insumos/cadastro"
            element={
              <PrivateRoute>
                <Layout>
                  <CadastroInsumos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saidas/registrar"
            element={
              <PrivateRoute>
                <Layout>
                  <RegistroSaidas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/entradas/registrar"
            element={
              <PrivateRoute>
                <Layout>
                  <RegistroEntradas />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/fornecedores/show/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ShowFornecedor />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/insumos/show/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ShowInsumo />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saidas/show/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ShowSaida />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/entradas/show/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ShowEntrada />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
