"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm
        ${type === "success"
          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
          : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
        {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="text-sm font-medium" style={{ fontFamily: "Syne, sans-serif" }}>{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const show = (message: string, type: "success" | "error" = "success") =>
    setToast({ message, type });

  const hide = () => setToast(null);

  return { toast, show, hide };
}
