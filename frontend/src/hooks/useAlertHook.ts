// src/hooks/useAlertHook.ts
import { useState } from "react";
import { type AlertType } from "../components/Alert/Alert";

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "info"
  ) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  // Métodos específicos para cada tipo
  const success = (title: string, message: string) =>
    showAlert(title, message, "success");
  const error = (title: string, message: string) =>
    showAlert(title, message, "error");
  const warning = (title: string, message: string) =>
    showAlert(title, message, "warning");
  const info = (title: string, message: string) =>
    showAlert(title, message, "info");

  return {
    alert,
    showAlert,
    hideAlert,
    success,
    error,
    warning,
    info,
  };
};
