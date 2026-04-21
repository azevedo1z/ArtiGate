import { useEffect, useRef, useState } from 'react';
import { zipCodeService } from '../services/zipCode.service';
import { ZipCodeLookupResult } from '../shared/types/types.shared';
import { extractErrorMessage } from '../utils/error.util';

interface UseZipCodeLookupOptions {
  onSuccess?: (result: ZipCodeLookupResult) => void;
  onError?: (message: string) => void;
  debounceMs?: number;
}

export const useZipCodeLookup = (
  zipCode: string,
  options: UseZipCodeLookupOptions = {}
) => {
  const { onSuccess, onError, debounceMs = 400 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const lastLookupRef = useRef<string>('');

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const normalized = zipCode.replace(/\D/g, '');
    if (normalized.length !== 8) return;
    if (lastLookupRef.current === normalized) return;

    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      lastLookupRef.current = normalized;
      setIsLoading(true);

      try {
        const data = await zipCodeService.lookup(normalized);
        if (!cancelled) onSuccessRef.current?.(data);
      } catch (error) {
        if (!cancelled)
          onErrorRef.current?.(
            extractErrorMessage(
              error,
              'Failed to look up ZIP code. Please fill the address manually.'
            )
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [zipCode, debounceMs]);

  return { isLoading };
};
