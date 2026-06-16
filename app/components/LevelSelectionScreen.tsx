interface LevelSelectionScreenProps {
  availableLevels: string[];
  selectedLevels: string[];
  onToggleLevel: (level: string) => void;
  onStart: () => void;
}

export default function LevelSelectionScreen({
  availableLevels,
  selectedLevels,
  onToggleLevel,
  onStart,
}: LevelSelectionScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 p-6">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900">
              Choose your study levels
            </h1>
            <p className="mt-3 text-slate-600">
              Select one or more levels to include in this study session.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableLevels.map((level) => {
              const selected = selectedLevels.includes(level);
              return (
                <button
                  key={level}
                  type="button"
                  className={`rounded-3xl border px-5 py-4 text-left text-sm font-semibold transition ${
                    selected
                      ? "border-slate-900 bg-slate-900 text-white shadow"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                  onClick={() => onToggleLevel(level)}
                >
                  <div>{level}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Include this level in your session
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              Selected levels:{" "}
              <span className="font-semibold text-slate-900">
                {selectedLevels.join(", ") || "None"}
              </span>
            </div>
            <button
              type="button"
              className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/30 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              onClick={onStart}
              disabled={!selectedLevels.length}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
