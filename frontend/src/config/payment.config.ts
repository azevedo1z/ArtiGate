function readBooleanEnv(value: unknown, fallback: boolean): boolean {
  if (typeof value !== 'string') return fallback;
  return value.trim().toLowerCase() === 'true';
}

export const PAYMENT_MOCK_ENABLED = readBooleanEnv(
  import.meta.env.VITE_ENABLE_PAYMENT_MOCK,
  false
);

export const MERCADO_PAGO_PUBLIC_KEY =
  (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY as string | undefined)?.trim() ??
  '';
