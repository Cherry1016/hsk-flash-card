"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import vocabData from "../const/complete.json";
import { getPinyin, VocabEntry } from "../components/flashcardUtils";

const allCards = vocabData as unknown as VocabEntry[];

function getBookmarks() {
  if (typeof window === "undefined") {
    return [] as string[];
  }
  try {
    const raw = localStorage.getItem("flashcard-bookmarks");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function buildExportText(bookmarkedWords: string[], entries: VocabEntry[]) {
  const saved = entries.filter((entry) =>
    bookmarkedWords.includes(entry.simplified),
  );
  return saved
    .map((entry) => {
      const pinyin = getPinyin(entry);
      const meanings = (entry.forms?.[0]?.meanings ?? []).join("; ");
      return `${entry.simplified} \n${pinyin}\n${meanings}`;
    })
    .join("\n\n");
}

export default function BookmarkPage() {
  const [list, setList] = React.useState<string[]>([]);

  React.useEffect(() => {
    setList(getBookmarks());
  }, []);

  const bookmarkedCards = allCards.filter((entry) =>
    list.includes(entry.simplified),
  );

  function exportNotes() {
    const text = buildExportText(list, bookmarkedCards);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flashcard-bookmarks.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearBookmarks() {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem("flashcard-bookmarks-old-5");
    setList([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                Bookmarked Words
              </h1>
              <p className="mt-2 text-slate-600">
                Export your bookmarked vocabulary as a note file.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-full border px-3 py-2 text-sm hover:bg-slate-100"
              >
                Back to study
              </Link>
              <button
                className="rounded-full border bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
                onClick={exportNotes}
              >
                Export note file
              </button>
              <button
                className="rounded-full border bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                onClick={clearBookmarks}
              >
                Clear bookmarks
              </button>
            </div>
          </div>

          {bookmarkedCards.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No bookmarked words yet.
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white p-4 shadow-sm">
              <div className="grid gap-4">
                {bookmarkedCards.map((entry) => (
                  <div
                    key={entry.simplified}
                    className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-2xl font-semibold text-slate-900">
                          {entry.simplified}
                        </div>
                        <div className="text-sm text-slate-600">
                          {getPinyin(entry)}
                        </div>
                      </div>
                      <div className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                        ★
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-slate-600">
                      {(entry.forms?.[0]?.meanings ?? []).map(
                        (meaning: string, idx: number) => (
                          <div key={idx}>{meaning}</div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
