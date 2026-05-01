import { PAYMENT_STATUS_OPTIONS } from '../../utils/constants.util';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SignInResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}

export interface User {
  _id: string;
  _name: string;
  _email: string;
  _phone: string;
  _homeAddressId: string;
  _jobAddressId: string;
  _badgeUrl: string;
}

export interface Role {
  _id: string;
  _name: string;
}

export interface Address {
  zipCode: string;
  street: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ZipCodeLookupResult {
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type AddressPrefix = 'home' | 'job';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleIds: string[];
  homeAddress: Address;
  jobAddress: Address;
  badgeUrl: string;
}

export interface Article {
  _id: string;
  _summary: string;
  _scoreAvg: number;
}

export interface Review {
  _id: string;
  _articleId: string;
  _reviewerId: string;
  _score: number;
  _commentary: string | null;
}

export interface CreateArticleData {
  summary: string;
  authorIds: string[];
  pdf: File;
}

export interface ArticleAttachmentMetadata {
  id: string;
  originalName: string;
  size: number;
  checksum: string;
}

export interface CreateArticleResponse {
  id: string;
  summary: string;
  scoreAvg: number;
  attachment: ArticleAttachmentMetadata;
}

export interface CreateReviewData {
  articleId: string;
  reviewerId: string;
  score: number;
  commentary: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  roles: string[];
  homeZipCode: string;
  homeStreet: string;
  homeComplement: string;
  homeNeighborhood: string;
  homeCity: string;
  homeState: string;
  jobZipCode: string;
  jobStreet: string;
  jobComplement: string;
  jobNeighborhood: string;
  jobCity: string;
  jobState: string;
}

export type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number]['value'];

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  paymentMethodId: string | null;
  payerEmail: string;
  gatewayPaymentId: string | null;
  idempotencyKey: string;
  failureReason: string | null;
}

export interface CreatePaymentRequest {
  token?: string;
  amount: number;
  currency?: string;
  paymentMethodId: string;
  payerEmail: string;
  payerIdentification?: {
    type: string;
    number: string;
  };
  description?: string;
  idempotencyKey: string;
}

export type CheckoutFormData = {
  cardNumber: string;
  cardholderName: string;
  cardExpiry: string;
  securityCode: string;
  paymentMethodId: string;
  identificationType: string;
  identificationNumber: string;
};
