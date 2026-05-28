"use client";

import React from "react";
import { useToast } from "@/hooks/useToast";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  const getVariantStyles = (variant: string) => {
    return {
      default: "bg-card border-border text-foreground shadow-lg shadow-black/5",
      success: "bg-emerald-600 border-emerald-500/20 text-white shadow-lg shadow-emerald-600/10",
      destructive: "bg-destructive border-destructive/20 text-white shadow-lg shadow-destructive/10",
      warning: "bg-amber-500 border-amber-400/20 text-white shadow-lg shadow-amber-500/10",
    }[variant] || "bg-card border-border text-foreground";
  };

  const getVariantIcon = (variant: string) => {
    return {
      default: <Sparkles size={16} className="text-primary shrink-0" />,
      success: <CheckCircle2 size={16} className="text-white shrink-0" />,
      destructive: <ShieldAlert size={16} className="text-white shrink-0" />,
      warning: <AlertTriangle size={16} className="text-white shrink-0" />,
    }[variant] || null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 w-full max-w-sm pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md ${getVariantStyles(
              t.variant || "default"
            )}`}
          >
            {getVariantIcon(t.variant || "default")}
            
            <div className="flex-1 space-y-0.5 select-none">
              <h5 className="text-[11px] font-black uppercase tracking-wider leading-none">
                {t.title}
              </h5>
              {t.description && (
                <p className="text-[10px] opacity-90 font-normal leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(t.id)}
              className="text-current/60 hover:text-current p-1 rounded-full hover:bg-current/10 transition shrink-0 cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
