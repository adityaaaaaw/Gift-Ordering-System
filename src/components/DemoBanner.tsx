"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, ShieldAlert, Key } from "lucide-react";

export const DemoBanner: React.FC = () => {
  const { isDemoMode } = useAuth();
  const [visible, setVisible] = useState(true);

  if (!isDemoMode || !visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-purple-600/90 text-white text-xs py-2.5 px-4 text-center backdrop-blur-md flex items-center justify-between border-b border-white/10 z-50 transition-all duration-300">
      <div className="flex items-center gap-2 mx-auto justify-center flex-wrap">
        <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] animate-pulse">
          <ShieldAlert size={11} /> DEMO MODE
        </span>
        <span className="font-medium text-white/95">
          Running with simulated Local Storage database. Connect Firebase keys in <code className="bg-black/20 px-1 py-0.5 rounded font-mono">.env.local</code> to save to Firestore.
        </span>
        <div className="inline-flex items-center gap-1.5 bg-black/35 text-violet-100 py-0.5 px-2 rounded-full border border-violet-400/20 font-medium">
          <Key size={11} className="text-amber-300" />
          <span>Admin SaaS: <strong className="text-white">admin@gift.com</strong> | password: <strong className="text-white">admin123</strong></span>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-white/75 hover:text-white transition p-1 hover:bg-white/10 rounded-full"
        aria-label="Close banner"
      >
        <X size={14} />
      </button>
    </div>
  );
};
export default DemoBanner;
