export interface VocabEntry {
  simplified: string;
  pinyin: string;
  level?: string[];
  forms?: Array<{
    meanings?: string[];
  }>;
}

export function filterByLevels(cards: VocabEntry[], selectedLevels: string[]) {
  if (!selectedLevels.length) return cards;
  return cards.filter(
    (entry) =>
      Array.isArray(entry.level) &&
      selectedLevels.some((selected) => entry.level?.includes(selected)),
  );
}

export function getAvailableLevels(cards: VocabEntry[]) {
  const levels = new Set<string>();
  cards.forEach((card) => {
    if (Array.isArray(card.level)) {
      card.level.forEach((l) => levels.add(l));
    }
  });
  return Array.from(levels).sort();
}

export function getPinyin(entry: VocabEntry): string {
  return entry.pinyin || "";
}

export function getMeanings(entry: VocabEntry): string[] {
  return entry.forms?.[0]?.meanings ?? [];
}

export function isMatchingWord(entry: VocabEntry, guess: string): boolean {
  const normalized = guess.trim().toLowerCase();
  return entry.simplified.toLowerCase() === normalized;
}

export function getHintCandidates(
  current: VocabEntry,
  cards: VocabEntry[],
  count: number,
): VocabEntry[] {
  const currentMeanings = getMeanings(current);
  if (!currentMeanings.length) return [];

  const candidates = cards
    .filter((card) => card.simplified !== current.simplified)
    .map((card) => {
      const cardMeanings = getMeanings(card);
      const matchCount = currentMeanings.filter((m) =>
        cardMeanings.some((cm) => cm.includes(m) || m.includes(cm)),
      ).length;
      return { card, matchCount };
    })
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, count)
    .map((item) => item.card);

  return candidates.length > 0
    ? candidates
    : cards.slice(0, count).filter((c) => c.simplified !== current.simplified);
}
