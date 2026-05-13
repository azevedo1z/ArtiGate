export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export const ROLES = {
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PDF_ATTACHMENT = {
  MIME_TYPE: 'application/pdf',
  EXTENSION: '.pdf',
} as const;

export const PDF_DOWNLOAD_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'private, no-store, max-age=0',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const;

export const PAYMENT_PAYER_IDENTIFICATION_TYPES = [
  'CPF',
  'CNPJ',
  'DNI',
  'CUIT',
  'CUIL',
  'RUT',
  'CC',
  'CE',
  'NIT',
  'CURP',
  'RFC',
  'RUC',
  'OTRO',
] as const;

export const PAYMENT_METHOD_IDS = [
  'visa',
  'master',
  'amex',
  'elo',
  'hipercard',
  'hiper',
  'diners',
  'discover',
] as const;

export const PAYER_ID_OTRO_REGEX = /^.{1,30}$/;

export const PAYER_ID_REGEX_BY_TYPE: Record<
  (typeof PAYMENT_PAYER_IDENTIFICATION_TYPES)[number],
  RegExp
> = {
  CPF: /^\d{11}$/,
  CNPJ: /^\d{14}$/,
  DNI: /^\d{7,8}$/,
  CUIT: /^\d{11}$/,
  CUIL: /^\d{11}$/,
  RUT: /^\d{7,8}[0-9Kk]$/,
  CC: /^\d{6,15}$/,
  CE: /^\d{6,15}$/,
  NIT: /^\d{6,15}$/,
  CURP: /^[A-Z]{4}\d{6}[A-Z]{6}\d{2}$/,
  RFC: /^[A-Z&N]{3,4}\d{6}[A-Z0-9]{3}$/,
  RUC: /^\d{6,15}$/,
  OTRO: PAYER_ID_OTRO_REGEX,
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_process', label: 'In Process' },
  { value: 'authorized', label: 'Authorized' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'charged_back', label: 'Charged Back' },
] as const;

export const PAYMENT_ACCESS_FEE = 49.9;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
