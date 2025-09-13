// src/components/Alert/Alert.tsx
import React, { useEffect } from "react";
import "./alert.css";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  duration = 0,
}) => {
  // Fechar automaticamente após a duração especificada
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  // Fechar com a tecla ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div
        className={`alert-container alert-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="alert-header">
          <h3 className="alert-title">{title}</h3>
          <button
            className="alert-close-btn"
            onClick={onClose}
            aria-label="Fechar alerta"
          >
            ×
          </button>
        </div>
        <div className="alert-content">
          <p className="alert-message">{message}</p>
        </div>
        <div className="alert-footer">
          <button className="alert-confirm-btn" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
