const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!fromEnv) {
    if (import.meta.env.PROD)
      throw new Error(
        'VITE_API_BASE_URL is required in production builds but was not provided.'
      );

    console.warn(
      `[config] VITE_API_BASE_URL not set — falling back to ${DEFAULT_API_BASE_URL}`
    );
    return DEFAULT_API_BASE_URL;
  }

  return fromEnv;
}

export const API_BASE_URL = resolveApiBaseUrl();
