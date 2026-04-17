export const scoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-700 bg-green-50 border-green-200';
  if (score >= 5) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
};
