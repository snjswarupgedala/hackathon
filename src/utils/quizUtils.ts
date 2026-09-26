// Helper to shuffle options and track new correct index
export function shuffleOptions(options: string[], correctIdx: number): { shuffledOptions: string[]; newCorrectIdx: number } {
  if (!options || options.length === 0) {
    return { shuffledOptions: ['Option A', 'Option B', 'Option C', 'Option D'], newCorrectIdx: 0 };
  }
  
  const items = options.map((opt, idx) => ({ opt, isCorrect: idx === correctIdx }));
  
  // Fisher-Yates Shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  
  const shuffledOptions = items.map((item) => item.opt);
  const newCorrectIdx = items.findIndex((item) => item.isCorrect);
  
  return { shuffledOptions, newCorrectIdx: newCorrectIdx >= 0 ? newCorrectIdx : 0 };
}
