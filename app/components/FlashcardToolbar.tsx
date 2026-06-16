interface FlashcardToolbarProps {
  index: number;
  total: number;
  knownCount: number;
  onOpenSummary: () => void;
  onShuffle: () => void;
  levels?: string[];
}

export default function FlashcardToolbar({
  index,
  total,
  knownCount,
  onOpenSummary,
  onShuffle,
  levels = [],
}: FlashcardToolbarProps) {
  const levelText = levels.length > 0 ? levels.join(", ") : "N/A";

  return (
    <div className="mb-4 rounded-[2rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Progress:</span>
            <span className="text-slate-700">
              {index} / {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Known:</span>
            <span className="text-slate-700">{knownCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Level:</span>
            <span className="text-slate-700">{levelText}</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/50 transition hover:opacity-95"
            onClick={onShuffle}
          >
            🔀 Shuffle
          </button>
          <button
            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800"
            onClick={onOpenSummary}
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
}
