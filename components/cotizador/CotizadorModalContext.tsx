"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface CotizadorModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CotizadorModalContext = createContext<CotizadorModalContextValue | null>(null);

export function CotizadorModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return (
    <CotizadorModalContext.Provider value={value}>{children}</CotizadorModalContext.Provider>
  );
}

export function useCotizadorModal() {
  const ctx = useContext(CotizadorModalContext);
  if (!ctx) {
    throw new Error("useCotizadorModal must be used within a CotizadorModalProvider");
  }
  return ctx;
}
