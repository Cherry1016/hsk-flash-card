"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { StudyMode } from "./flashcardTypes";

interface AppShellContextValue {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  mode: StudyMode;
  setMode: (mode: StudyMode) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<StudyMode>("flashcard");

  return (
    <AppShellContext.Provider
      value={{ drawerOpen, setDrawerOpen, mode, setMode }}
    >
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider");
  }
  return context;
}
