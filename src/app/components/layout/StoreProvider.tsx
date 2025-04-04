"use client";

import { ReactNode, createContext, useContext } from "react";
import { useStore } from "@/app/lib/store";

// Create context
const StoreContext = createContext<ReturnType<typeof useStore> | undefined>(undefined);

// Provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  // This is where we can initialize any store-related logic if needed
  const store = useStore();
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use the store context
export function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
} 