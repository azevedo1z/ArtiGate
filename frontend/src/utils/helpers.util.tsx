export const stripMask = (value: string) =>
  value ? value.replace(/\D/g, '') : '';
