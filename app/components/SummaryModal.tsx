"use client";

import React from "react";

interface FailedWord {
  simplified: string;
  pinyin: string;
  meanings: string[];
}

interface SummaryModalProps {
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
  cardsViewed: number;
  total: number;
  correctCount: number;
  attemptCount: number;
  wrongCount: number;
  skipCount: number;
  hintClickCount: number;
  knownToggleCount: number;
  flipCount: number;
  failedWords: FailedWord[];
}

function renderSummaryItem(label: string, value: number, total: number) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-slate-900">
        {value} / {total} ({percentage}%)
      </span>
    </div>
  );
}

export default function SummaryModal({
  open,
  onClose,
  onFinish,
  cardsViewed,
  total,
  correctCount,
  attemptCount,
  wrongCount,
  skipCount,
  hintClickCount,
  knownToggleCount,
  flipCount,
  failedWords,
}: SummaryModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Session Summary
            </h2>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close summary"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {renderSummaryItem("Total words", cardsViewed, total)}
              {renderSummaryItem("Total correct", correctCount, attemptCount)}
              {renderSummaryItem("Total wrong", wrongCount, attemptCount)}
              {renderSummaryItem("Total skips", skipCount, cardsViewed)}
              {renderSummaryItem("Hint clicks", hintClickCount, cardsViewed)}
              {renderSummaryItem(
                "Known toggles",
                knownToggleCount,
                cardsViewed,
              )}
              {renderSummaryItem("Flip actions", flipCount, cardsViewed)}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Failed vocabulary
                </span>
                <span className="text-sm text-slate-600">
                  {failedWords.length}
                </span>
              </div>
              {failedWords.length > 0 ? (
                <div className="grid gap-3">
                  {failedWords.map((word) => (
                    <div
                      key={word.simplified}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-base font-semibold text-slate-900">
                        <span>{word.simplified}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {word.pinyin}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        {word.meanings.join("; ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  No failed words this session.
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              onClick={onClose}
            >
              Continue Studying
            </button>
            <button
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={onFinish}
            >
              Finish Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
