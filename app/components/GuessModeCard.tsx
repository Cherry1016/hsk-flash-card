import { getPinyin, VocabEntry } from "./flashcardUtils";

interface GuessModeCardProps {
  meanings: string[];
  guess: string;
  onGuessChange: (value: string) => void;
  onSubmit: () => void;
  onDontKnow: () => void;
  onPrev: () => void;
  onNext: () => void;
  guessStatus: "idle" | "correct" | "wrong";
  showHints: boolean;
  hintCards: VocabEntry[];
}

export default function GuessModeCard({
  meanings,
  guess,
  onGuessChange,
  onSubmit,
  onDontKnow,
  onPrev,
  onNext,
  guessStatus,
  showHints,
  hintCards,
}: GuessModeCardProps) {
  return (
    <div>
      <div className="text-center text-3xl font-semibold mb-4">
        Guess the word from its meaning
      </div>
      <div className="rounded-2xl bg-slate-100 p-5 mb-4">
        <div className="text-slate-700 font-medium mb-2">Meaning</div>
        <div className="space-y-2 text-slate-600">
          {meanings.map((meaning, idx) => (
            <div key={idx}>{meaning}</div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your answer
        </label>
        <input
          className="w-full rounded-3xl border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={guess}
          onChange={(event) => onGuessChange(event.target.value)}
          placeholder="Type the simplified Chinese word"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <button
          className="px-4 py-2 rounded-3xl bg-slate-900 text-white shadow hover:bg-slate-800"
          onClick={onSubmit}
        >
          Submit
        </button>
        <button
          className="px-4 py-2 rounded-3xl border border-slate-200 hover:bg-slate-50"
          onClick={onDontKnow}
        >
          I don't know
        </button>
        <button
          className="px-4 py-2 rounded-3xl border border-slate-200 hover:bg-slate-50"
          onClick={onPrev}
        >
          Prev
        </button>
        <button
          className="px-4 py-2 rounded-3xl border border-slate-200 hover:bg-slate-50"
          onClick={onNext}
        >
          Next
        </button>
      </div>
      <div className="mt-4 min-h-[2rem] text-center text-sm">
        {guessStatus === "correct" && (
          <span className="text-emerald-700">Correct! Well done.</span>
        )}
        {guessStatus === "wrong" && !showHints && (
          <span className="text-rose-600">
            Not quite — try again or click "I don't know".
          </span>
        )}
      </div>
      {showHints && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <div className="font-semibold text-slate-800 mb-3">
            Hint words with similar meaning
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {hintCards.map((hintCard) => (
              <div
                key={hintCard.simplified}
                className="rounded-xl bg-white p-3 border shadow-sm"
              >
                <div className="font-semibold">{hintCard.simplified}</div>
                <div className="text-slate-500 text-sm">
                  {getPinyin(hintCard)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
