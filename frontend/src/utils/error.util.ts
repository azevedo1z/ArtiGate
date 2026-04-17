import { AxiosError } from 'axios';

export const extractErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    if (data?.message)
      return Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message;

    if (error.code === 'ERR_NETWORK')
      return 'Network error. Please check your connection.';
  }
  return fallback;
};
