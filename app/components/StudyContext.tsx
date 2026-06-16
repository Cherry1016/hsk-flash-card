"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface StudyContextValue {
  selectedLevels: string[];
  setSelectedLevels: (levels: string[] | ((prev: string[]) => string[])) => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  const setSelectedLevelsWrapper = (
    levels: string[] | ((prev: string[]) => string[]),
  ) => {
    setSelectedLevels(levels);
  };

  return (
    <StudyContext.Provider value={{ selectedLevels, setSelectedLevels: setSelectedLevelsWrapper }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within StudyProvider");
  }
  return context;
}
