"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import vocabData from "../const/complete.json";
import { getAvailableLevels, VocabEntry } from "./flashcardUtils";
import LevelSelectionScreen from "./LevelSelectionScreen";
import { useStudy } from "./StudyContext";

const allCards = vocabData as VocabEntry[];

export default function LevelSelectionPage() {
  const router = useRouter();
  const { setSelectedLevels } = useStudy();
  const allLevels = useMemo(() => getAvailableLevels(allCards), []);
  const defaultLevels = useMemo(() => [], [allLevels]);

  const [localSelectedLevels, setLocalSelectedLevels] =
    useState<string[]>(defaultLevels);

  const handleStart = () => {
    setSelectedLevels(localSelectedLevels);
    router.push("/flashcard");
  };

  return (
    <LevelSelectionScreen
      availableLevels={allLevels}
      selectedLevels={localSelectedLevels}
      onToggleLevel={(level: string) => {
        setLocalSelectedLevels((prev) => {
          const next = prev.includes(level)
            ? prev.filter((item) => item !== level)
            : [...prev, level];
          return next.length === 0 ? prev : next;
        });
      }}
      onStart={handleStart}
    />
  );
}
