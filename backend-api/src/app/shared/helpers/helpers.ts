import { PAYER_ID_REGEX_BY_TYPE } from '../constants';

export const getPayerIdType = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toUpperCase() : '';

export const getPayerIdRegex = (type: string): RegExp | undefined => {
  const key = type as keyof typeof PAYER_ID_REGEX_BY_TYPE;
  return PAYER_ID_REGEX_BY_TYPE[key];
};
