import { useEffect, useRef, useState } from 'react';
import {
  MERCADO_PAGO_PUBLIC_KEY,
  PAYMENT_MOCK_ENABLED,
} from '../config/payment.config';

const SDK_URL = 'https://sdk.mercadopago.com/js/v2';

export type CardTokenInput = {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType?: string;
  identificationNumber?: string;
};

type MercadoPagoCardTokenResponse = { id: string };

type MercadoPagoInstance = {
  createCardToken: (
    input: CardTokenInput
  ) => Promise<MercadoPagoCardTokenResponse>;
};

type MercadoPagoConstructor = new (
  publicKey: string,
  options?: { locale?: string }
) => MercadoPagoInstance;

declare global {
  interface Window {
    MercadoPago?: MercadoPagoConstructor;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadMercadoPagoSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Mercado Pago SDK requires a browser.'));
  }
  if (window.MercadoPago) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load Mercado Pago SDK.'))
      );
      return;
    }
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Mercado Pago SDK.'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useMercadoPago() {
  const [isReady, setIsReady] = useState(PAYMENT_MOCK_ENABLED);
  const [error, setError] = useState<string | null>(null);
  const instanceRef = useRef<MercadoPagoInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (PAYMENT_MOCK_ENABLED) {
      setIsReady(true);
      return;
    }

    if (!MERCADO_PAGO_PUBLIC_KEY) {
      setError(
        'Mercado Pago public key is not configured (set VITE_MERCADO_PAGO_PUBLIC_KEY).'
      );
      return;
    }

    loadMercadoPagoSdk()
      .then(() => {
        if (cancelled || !window.MercadoPago) return;
        instanceRef.current = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
          locale: 'pt-BR',
        });
        setIsReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const createCardToken = async (input: CardTokenInput): Promise<string> => {
    if (PAYMENT_MOCK_ENABLED) {
      const random =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return `mock-token-${random}`;
    }

    if (!instanceRef.current) {
      throw new Error('Mercado Pago SDK is not ready yet.');
    }

    const response = await instanceRef.current.createCardToken(input);
    if (!response?.id)
      throw new Error('Mercado Pago did not return a card token.');

    return response.id;
  };

  return {
    isReady,
    isMock: PAYMENT_MOCK_ENABLED,
    error,
    createCardToken,
  };
}
