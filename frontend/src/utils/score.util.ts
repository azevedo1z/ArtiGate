export const scoreColor = (score: number): string => {
  if (score >= 8) return 'text-accent-700 bg-accent-50 border-accent-200';
  if (score >= 5) return 'text-ink-700 bg-ink-50 border-ink-200';
  return 'text-red-700 bg-red-50 border-red-200';
};
