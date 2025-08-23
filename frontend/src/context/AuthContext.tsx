// src/context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  nome: string;
  email: string;
  matricula: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, senha: string) => {
    const res = await axios.post("http://localhost:3000/api/login", {
      email,
      senha,
    });
    const { token, ...userData } = res.data;

    Cookies.set("token", token, { expires: 1 }); // expira em 1 dia
    setUser(userData);
    navigate("/");
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
