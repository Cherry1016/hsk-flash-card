"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import vocabData from "../const/complete.json";
import {
  filterByLevels,
  getAvailableLevels,
  getHintCandidates,
  getMeanings,
  getPinyin,
  isMatchingWord,
  VocabEntry,
} from "./flashcardUtils";
import FlashcardToolbar from "./FlashcardToolbar";
import GuessModeCard from "./GuessModeCard";
import LevelSelectionScreen from "./LevelSelectionScreen";
import SummaryModal from "./SummaryModal";
import { GuessStatus } from "./flashcardTypes";
import { useStudy } from "./StudyContext";

const allCards = vocabData as unknown as VocabEntry[];

export default function GuessStudyPage() {
  const router = useRouter();
  const { selectedLevels, setSelectedLevels } = useStudy();
  const allLevels = useMemo(() => getAvailableLevels(allCards), []);
  const defaultLevels = useMemo(
    () =>
      allLevels.includes("old-5")
        ? ["old-5"]
        : allLevels.length
          ? [allLevels[0]]
          : [],
    [allLevels],
  );

  const [sessionStarted, setSessionStarted] = useState(
    selectedLevels.length > 0,
  );
  const cards = useMemo(
    () =>
      filterByLevels(allCards, sessionStarted ? selectedLevels : defaultLevels),
    [selectedLevels, sessionStarted],
  );
  const storageKey = "flashcard-known";
  const bookmarkStorageKey = "flashcard-bookmarks";
  const sessionStorageKey = "flashcard-session-guess";

  const [order, setOrder] = useState<number[]>(() =>
    filterByLevels(allCards, defaultLevels).map((_: VocabEntry, index: number) => index),
  );
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [guessStatus, setGuessStatus] = useState<GuessStatus>("idle");
  const [showHints, setShowHints] = useState(false);
  const [hintCards, setHintCards] = useState<VocabEntry[]>([]);
  const [knownSet, setKnownSet] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw =
        localStorage.getItem(bookmarkStorageKey) ??
        localStorage.getItem("flashcard-bookmarks-old-5");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [cardsViewed, setCardsViewed] = useState<Set<number>>(new Set());
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [hintClickCount, setHintClickCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [knownToggleCount, setKnownToggleCount] = useState(0);
  const [bookmarkToggleCount, setBookmarkToggleCount] = useState(0);
  const [failedWords, setFailedWords] = useState<
    {
      simplified: string;
      pinyin: string;
      meanings: string[];
    }[]
  >([]);
  const sessionRestored = useRef(false);

  // Load bookmarks and known on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const knownRaw =
      localStorage.getItem(storageKey) ??
      localStorage.getItem("flashcard-known-old-5");
    if (knownRaw) {
      try {
        const parsed = JSON.parse(knownRaw);
        setKnownSet(new Set(parsed));
      } catch {
        setKnownSet(new Set());
      }
    }

    const bookmarkRaw =
      localStorage.getItem(bookmarkStorageKey) ??
      localStorage.getItem("flashcard-bookmarks-old-5");
    if (bookmarkRaw) {
      try {
        const parsed = JSON.parse(bookmarkRaw);
        setBookmarks(new Set(parsed));
      } catch {
        setBookmarks(new Set());
      }
    }

    const sessionRaw =
      localStorage.getItem(sessionStorageKey) ??
      localStorage.getItem("flashcard-session-old-5");
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        const restoredSelectedLevels =
          Array.isArray(parsed.selectedLevels) && parsed.selectedLevels.length
            ? parsed.selectedLevels
            : defaultLevels;
        const restoredCards = filterByLevels(allCards, restoredSelectedLevels);
        const restoredOrder =
          Array.isArray(parsed.order) &&
          parsed.order.length === restoredCards.length
            ? parsed.order
            : restoredCards.map((_: VocabEntry, i: number) => i);

        setSelectedLevels(restoredSelectedLevels);
        setOrder(restoredOrder);
        setIndex(
          typeof parsed.index === "number"
            ? Math.min(Math.max(parsed.index, 0), restoredOrder.length - 1)
            : 0,
        );
        setCardsViewed(new Set(parsed.cardsViewed ?? []));
        setAttemptCount(parsed.attemptCount ?? 0);
        setCorrectCount(parsed.correctCount ?? 0);
        setWrongCount(parsed.wrongCount ?? 0);
        setSkipCount(parsed.skipCount ?? 0);
        setHintClickCount(parsed.hintClickCount ?? 0);
        setFlipCount(parsed.flipCount ?? 0);
        setKnownToggleCount(parsed.knownToggleCount ?? 0);
        setBookmarkToggleCount(parsed.bookmarkToggleCount ?? 0);
        setSessionStarted(true);
      } catch {
        // ignore invalid session state
      }
    }

    sessionRestored.current = true;
  }, []);

  useEffect(() => {
    if (!sessionStarted) return;
    const nextCards = filterByLevels(allCards, selectedLevels);
    setOrder(nextCards.map((_: VocabEntry, i: number) => i));
    setIndex(0);
  }, [selectedLevels, sessionStarted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(knownSet)));
  }, [knownSet]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      bookmarkStorageKey,
      JSON.stringify(Array.from(bookmarks)),
    );
  }, [bookmarks]);

  const saveSessionState = () => {
    if (typeof window === "undefined" || !sessionRestored.current) {
      return;
    }

    const sessionState = {
      order,
      index,
      selectedLevels,
      cardsViewed: Array.from(cardsViewed),
      attemptCount,
      correctCount,
      wrongCount,
      skipCount,
      hintClickCount,
      flipCount,
      knownToggleCount,
      bookmarkToggleCount,
    };

    localStorage.setItem(sessionStorageKey, JSON.stringify(sessionState));
  };

  useEffect(() => {
    if (typeof window === "undefined" || !sessionRestored.current) {
      return;
    }

    saveSessionState();
    window.addEventListener("pagehide", saveSessionState);

    return () => {
      window.removeEventListener("pagehide", saveSessionState);
      saveSessionState();
    };
  }, [
    order,
    index,
    selectedLevels,
    cardsViewed,
    attemptCount,
    correctCount,
    wrongCount,
    skipCount,
    hintClickCount,
    flipCount,
    knownToggleCount,
    bookmarkToggleCount,
  ]);

  useEffect(() => {
    setGuessStatus("idle");
  }, [index]);

  useEffect(() => {
    setGuess("");
    setShowHints(false);
  }, [index]);

  useEffect(() => {
    setCardsViewed((prev) => {
      const next = new Set(prev);
      next.add(order[index]);
      return next;
    });
  }, [index, order]);

  if (!sessionStarted) {
    return (
      <LevelSelectionScreen
        availableLevels={allLevels}
        selectedLevels={selectedLevels}
        onToggleLevel={(level: string) => {
          setSelectedLevels((prev: string[]) => {
            const next = prev.includes(level)
              ? prev.filter((item: string) => item !== level)
              : [...prev, level];
            return next.length === 0 ? prev : next;
          });
        }}
        onStart={() => {
          setSessionStarted(true);
          setOrder(
            filterByLevels(allCards, selectedLevels).map((_: VocabEntry, index: number) => index),
          );
          setIndex(0);
        }}
      />
    );
  }

  if (!cards.length) {
    return (
      <div className="p-6">
        No vocabulary found for the selected levels. Please choose at least one
        level and try again.
      </div>
    );
  }

  const current = cards[order[index]];
  const simplified = current?.simplified ?? "";
  const meanings = getMeanings(current);
  const isBookmarked = bookmarks.has(simplified);

  const moveNext = () => {
    setIndex((currentIndex) => Math.min(order.length - 1, currentIndex + 1));
  };

  const movePrev = () => {
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const markKnown = (word: string) => {
    setKnownToggleCount((count) => count + 1);
    setKnownSet((prev) => {
      const next = new Set(prev);
      next.add(word);
      return next;
    });
  };

  const handleGuessSubmit = () => {
    setAttemptCount((count) => count + 1);
    if (isMatchingWord(current, guess)) {
      markKnown(simplified);
      setGuessStatus("correct");
      setCorrectCount((count) => count + 1);
      moveNext();
      return;
    }
    setGuessStatus("wrong");
    setWrongCount((count) => count + 1);
  };

  const handleDontKnow = () => {
    setShowHints(true);
    setGuessStatus("wrong");
    setHintCards(getHintCandidates(current, cards, 10));
    setHintClickCount((count) => count + 1);
    setSkipCount((count) => count + 1);
    setFailedWords((prev) => {
      if (prev.some((entry) => entry.simplified === simplified)) return prev;
      return [
        ...prev,
        {
          simplified,
          pinyin: getPinyin(current),
          meanings: getMeanings(current),
        },
      ];
    });
  };

  const toggleBookmark = (word: string) => {
    setBookmarkToggleCount((count) => count + 1);
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  const shuffle = () => {
    const nextOrder = [...order];
    for (let i = nextOrder.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
    }
    setOrder(nextOrder);
    setIndex(0);
  };

  const clearSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(sessionStorageKey);
    }
    setSelectedLevels([]);
    setSessionStarted(false);
    setCardsViewed(new Set());
    setAttemptCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSkipCount(0);
    setHintClickCount(0);
    setFlipCount(0);
    setKnownToggleCount(0);
    setBookmarkToggleCount(0);
    setFailedWords([]);
    setSummaryOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 md:p-6">
      <div className="w-full max-w-3xl md:pl-0">
        <FlashcardToolbar
          index={index + 1}
          total={order.length}
          knownCount={knownSet.size}
          onOpenSummary={() => setSummaryOpen(true)}
          onShuffle={shuffle}
          levels={selectedLevels}
        />

        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/95 p-6 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.35)]">
          <GuessModeCard
            meanings={meanings}
            guess={guess}
            onGuessChange={setGuess}
            onSubmit={handleGuessSubmit}
            onDontKnow={handleDontKnow}
            onPrev={movePrev}
            onNext={moveNext}
            guessStatus={guessStatus}
            showHints={showHints}
            hintCards={hintCards}
          />
        </div>
      </div>

      <SummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        onFinish={clearSession}
        cardsViewed={cardsViewed.size}
        total={cards.length}
        correctCount={correctCount}
        attemptCount={attemptCount}
        wrongCount={wrongCount}
        skipCount={skipCount}
        hintClickCount={hintClickCount}
        knownToggleCount={knownToggleCount}
        flipCount={flipCount}
        failedWords={failedWords}
      />
    </div>
  );
}
