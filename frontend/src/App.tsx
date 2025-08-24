// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./components/Layout";
import UsuarioForm from "./pages/usuarios/UsuarioForm";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/usuarios/cadastro" element={<UsuarioForm />} />
          <Route path="/login" element={<Login />} />
          {/* <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
