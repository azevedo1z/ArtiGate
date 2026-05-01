import { PAYMENT_STATUS_OPTIONS } from '../constants';

export type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number]['value'];
