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
