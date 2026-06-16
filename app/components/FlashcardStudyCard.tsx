interface FlashcardStudyCardProps {
  simplified: string;
  pinyin: string;
  meanings: string[];
  flipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onKnow: () => void;
  onDontKnow: () => void;
  isBookmarked: boolean;
  toggleBookmark: () => void;
}

export default function FlashcardStudyCard({
  simplified,
  pinyin,
  meanings,
  flipped,
  onFlip,
  onPrev,
  onNext,
  onKnow,
  onDontKnow,
  isBookmarked,
  toggleBookmark,
}: FlashcardStudyCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/95 p-6 shadow-[0_28px_60px_-32px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-center gap-3 text-center mb-3">
        <div className="text-7xl font-semibold tracking-tight text-slate-900">
          {simplified}
        </div>
        <button
          className={`text-4xl leading-none transition ${isBookmarked ? "text-amber-400" : "text-slate-300 hover:text-slate-500"}`}
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>
      <div className="text-center text-slate-600 mb-4 text-lg">{pinyin}</div>
      <div className="mb-4 text-center text-slate-500">
        {flipped ? (
          <div className="space-y-2">
            {meanings.map((meaning, idx) => (
              <div key={idx}>{meaning}</div>
            ))}
          </div>
        ) : (
          <div className="italic">Click Flip to reveal the meaning.</div>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-3xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={onPrev}
        >
          Prev
        </button>
        <button
          className="w-full sm:w-auto px-6 py-2 rounded-3xl bg-slate-900 text-white transition hover:bg-slate-800"
          onClick={onFlip}
        >
          Flip
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 rounded-3xl border border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={onNext}
        >
          Next
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          className="w-full sm:w-auto rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500"
          onClick={onKnow}
        >
          I know this
        </button>
        <button
          className="w-full sm:w-auto rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-rose-500"
          onClick={onDontKnow}
        >
          I don't know
        </button>
      </div>
    </div>
  );
}
