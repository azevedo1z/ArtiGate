import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Lock,
  User as UserIcon,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Input from '../components/input.component';
import Select from '../components/select.component';
import Wrapper from '../components/wrapper.component';
import {
  IDENTIFICATION_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '../utils/constants.util';
import { paymentService } from '../services/payment.service';
import { useUser } from '../hooks/useUser';
import { useMercadoPago } from '../hooks/useMercadoPago';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';
import { stripMask } from '../utils/helpers.util';

const DEFAULT_AMOUNT = 49.9;

type CheckoutFormData = {
  cardNumber: string;
  cardholderName: string;
  cardExpiry: string;
  securityCode: string;
  paymentMethodId: string;
  installments: string;
  identificationType: string;
  identificationNumber: string;
};

const initialFormData: CheckoutFormData = {
  cardNumber: '',
  cardholderName: '',
  cardExpiry: '',
  securityCode: '',
  paymentMethodId: 'visa',
  installments: '1',
  identificationType: '',
  identificationNumber: '',
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();
  const { isReady, isMock, error: sdkError, createCardToken } = useMercadoPago();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const installmentOptions = useMemo(
    () =>
      [1, 2, 3, 4, 6, 12].map((value) => ({
        value: String(value),
        label: value === 1 ? '1x (no interest)' : `${value}x`,
      })),
    []
  );

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
    try {
      const token = await createCardToken({
        cardNumber: stripMask(formData.cardNumber),
        cardholderName: formData.cardholderName.trim(),
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: expirationYear,
        securityCode: formData.securityCode,
        identificationType: formData.identificationType || undefined,
        identificationNumber:
          formData.identificationNumber.trim() || undefined,
      });

      const payment = await paymentService.create({
        token,
        amount: DEFAULT_AMOUNT,
        paymentMethodId: formData.paymentMethodId,
        installments: Number(formData.installments) || 1,
        payerEmail: userData._email,
        payerIdentificationType: formData.identificationType || undefined,
        payerIdentificationNumber:
          formData.identificationNumber.trim() || undefined,
        description: 'ArtiGate access fee',
        idempotencyKey: crypto.randomUUID(),
      });

      if (payment.status === 'approved' || payment.status === 'authorized') {
        toast.success('Payment approved.');
      } else if (
        payment.status === 'pending' ||
        payment.status === 'in_process'
      ) {
        toast.success('Payment is being processed.');
      } else {
        toast.error(
          `Payment ${payment.status}: ${payment.failureReason ?? 'try a different card.'}`
        );
      }

      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(
        extractErrorMessage(error, 'Could not complete the payment.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconClass = 'h-4 w-4 text-ink-400';

  return (
    <Wrapper centered={false}>
      <Container size="md" className="space-y-6 py-12">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Pay your access fee
          </h1>
          <p className="text-ink-500 text-sm">
            Card details are tokenized in your browser by Mercado Pago — they
            never reach ArtiGate's servers.
          </p>
        </div>

        {sdkError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-3">
            {sdkError}
          </div>
        )}
        {isMock && (
          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-4 py-2">
            Mock mode is on — submitting will skip tokenization and the backend
            will auto-approve the charge locally.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-snow rounded-lg border border-ink-100 divide-y divide-ink-100"
        >
          <section className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
                  Amount
                </p>
                <p className="text-2xl font-semibold text-ink-800">
                  R$ {DEFAULT_AMOUNT.toFixed(2)}
                </p>
              </div>
              <ShieldCheck className="h-6 w-6 text-primary-500" />
            </div>
          </section>

          <section className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-ink-400" />
              <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Card details
              </h2>
            </div>

            <Input
              id="cardNumber"
              type="text"
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              leadingIcon={<CreditCard className={iconClass} />}
              required
              mask="9999 9999 9999 9999"
            />

            <Input
              id="cardholderName"
              type="text"
              label="Cardholder Name"
              placeholder="As printed on the card"
              value={formData.cardholderName}
              onChange={(e) => handleChange('cardholderName', e.target.value)}
              leadingIcon={<UserIcon className={iconClass} />}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                id="cardExpiry"
                type="text"
                label="Expiry (MM/YY)"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={(e) => handleChange('cardExpiry', e.target.value)}
                leadingIcon={<Calendar className={iconClass} />}
                required
                mask="99/99"
              />

              <Input
                id="securityCode"
                type="password"
                label="CVV"
                placeholder="123"
                value={formData.securityCode}
                onChange={(e) => handleChange('securityCode', e.target.value)}
                leadingIcon={<Lock className={iconClass} />}
                required
                mask="9999"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="paymentMethodId"
                  className="text-xs font-medium text-ink-600 uppercase tracking-wide block"
                >
                  Card Brand
                </label>
                <Select
                  id="paymentMethodId"
                  placeholder="Select brand"
                  options={PAYMENT_METHOD_OPTIONS}
                  value={formData.paymentMethodId}
                  onChange={(e) =>
                    handleChange('paymentMethodId', e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="installments"
                  className="text-xs font-medium text-ink-600 uppercase tracking-wide block"
                >
                  Installments
                </label>
                <Select
                  id="installments"
                  placeholder="Select installments"
                  options={installmentOptions}
                  value={formData.installments}
                  onChange={(e) =>
                    handleChange('installments', e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-ink-400" />
              <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Payer identification (optional)
              </h2>
            </div>
            <p className="text-xs text-ink-400">
              Required by some Mercado Pago methods. Pick the document type from
              your country.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="identificationType"
                  className="text-xs font-medium text-ink-600 uppercase tracking-wide block"
                >
                  Document Type
                </label>
                <Select
                  id="identificationType"
                  placeholder="None"
                  options={IDENTIFICATION_TYPE_OPTIONS}
                  value={formData.identificationType}
                  onChange={(e) =>
                    handleChange('identificationType', e.target.value)
                  }
                />
              </div>
              <Input
                id="identificationNumber"
                type="text"
                label="Document Number"
                placeholder="Numbers, dots, dashes"
                value={formData.identificationNumber}
                onChange={(e) =>
                  handleChange('identificationNumber', e.target.value)
                }
              />
            </div>
          </section>

          <section className="p-6 flex gap-3">
            <Button
              type="submit"
              variantClassName="primary"
              fullWidth
              isLoading={isSubmitting}
              loadingText="Processing..."
              disabled={!isReady}
              leadingIcon={
                isReady ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )
              }
            >
              {isReady ? 'Pay now' : 'Loading SDK...'}
            </Button>
            <Button
              type="button"
              variantClassName="secondary"
              fullWidth
              onClick={() => navigate(ROUTES.HOME)}
              leadingIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Cancel
            </Button>
          </section>
        </form>
      </Container>
    </Wrapper>
  );
};

export default CheckoutPage;
