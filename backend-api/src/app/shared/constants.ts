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
