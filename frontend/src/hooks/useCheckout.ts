import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { paymentService } from '../services/payment.service';
import { useUser } from './useUser';
import { useMercadoPago } from './useMercadoPago';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';
import { stripMask } from '../utils/helpers.util';
import { setAccessFeePaid } from '../store/slices/payment.slice';
import {
  CheckoutFormData,
  Payment,
  PaymentStatus,
} from '../shared/types/types.shared';

const IDEMPOTENCY_STORAGE_KEY = 'checkout:idempotencyKey';

const generateIdempotencyKey = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getOrCreateIdempotencyKey = (): string => {
  if (typeof window === 'undefined') return generateIdempotencyKey();
  const existing = sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY);
  if (existing) return existing;
  const fresh = generateIdempotencyKey();
  sessionStorage.setItem(IDEMPOTENCY_STORAGE_KEY, fresh);
  return fresh;
};

const reportPaymentResult = (
  status: PaymentStatus,
  failureReason: string | null
): void => {
  if (status === 'approved' || status === 'authorized') {
    toast.success('Payment approved.');
    return;
  }
  if (status === 'pending' || status === 'in_process') {
    toast.success('Payment is being processed.');
    return;
  }
  toast.error(
    `Payment ${status}: ${failureReason ?? 'An error occurred, try again.'}`
  );
};

export function useCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useUser();
  const { isReady, isMock, error: sdkError, tokenizeCard } = useMercadoPago();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() =>
    getOrCreateIdempotencyKey()
  );

  useEffect(() => {
    if (!sessionStorage.getItem(IDEMPOTENCY_STORAGE_KEY)) {
      sessionStorage.setItem(IDEMPOTENCY_STORAGE_KEY, idempotencyKey);
    }
  }, [idempotencyKey]);

  const submit = async (formData: CheckoutFormData): Promise<void> => {
    if (!userData?._email) {
      toast.error('Could not resolve your email. Please sign in again.');
      return;
    }

    if (!isReady) {
      toast.error('Payment SDK is not ready yet. Please wait a moment.');
      return;
    }

    const [expirationMonth, expirationYear] = formData.cardExpiry.split('/');
    if (!expirationMonth || !expirationYear) {
      toast.error('Card expiry must follow the MM/YY format.');
      return;
    }

    setIsSubmitting(true);

    let token: string;
    let detectedPaymentMethodId: string | null;
    try {
      const tokenization = await tokenizeCard({
        cardNumber: stripMask(formData.cardNumber),
        cardholderName: formData.cardholderName.trim(),
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: expirationYear,
        securityCode: formData.securityCode,
        identificationType: formData.identificationType.trim() || undefined,
        identificationNumber: formData.identificationNumber.trim() || undefined,
      });
      token = tokenization.token;
      detectedPaymentMethodId = tokenization.paymentMethodId;
    } catch (error) {
      setIsSubmitting(false);
      toast.error(extractErrorMessage(error, 'Could not tokenize card.'));
      return;
    }

    // In real Mercado Pago mode the SDK resolves the card brand from the BIN;
    // if it can't, abort rather than guessing 'visa' (the gateway would reject
    // a mismatching brand anyway). Mock mode always returns null, so we fall
    // back so the local auto-approval flow keeps working.
    if (!isMock && !detectedPaymentMethodId) {
      setIsSubmitting(false);
      toast.error(
        'Could not identify your card brand. Please double-check the number.'
      );
      return;
    }
    const resolvedPaymentMethodId = detectedPaymentMethodId ?? 'visa';

    try {
      const payerIdentification =
        formData.identificationType.trim() &&
        formData.identificationNumber.trim().length > 0
          ? {
              type: formData.identificationType.trim(),
              number: formData.identificationNumber.trim(),
            }
          : undefined;

      const payment: Payment = await paymentService.create({
        token,
        paymentMethodId: resolvedPaymentMethodId,
        payerEmail: userData._email,
        payerIdentification,
        description: 'ArtiGate access fee',
        idempotencyKey,
      });

      sessionStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
      setIdempotencyKey(getOrCreateIdempotencyKey());

      reportPaymentResult(payment._status, payment._failureReason);

      if (payment._status === 'approved' || payment._status === 'authorized') {
        dispatch(setAccessFeePaid(true));
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      toast.error(
        extractErrorMessage(error, 'Could not complete the payment.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isReady,
    isMock,
    sdkError,
    isSubmitting,
    submit,
  };
}
