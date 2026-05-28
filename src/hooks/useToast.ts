import { useState, useEffect } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | "warning";
}

type ToastListener = (toast: ToastMessage) => void;
const listeners = new Set<ToastListener>();

export const toast = (message: Omit<ToastMessage, "id">) => {
  const id = Math.random().toString(36).substr(2, 9);
  const fullToast: ToastMessage = { ...message, id };
  listeners.forEach((listener) => listener(fullToast));
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, dismissToast };
};
