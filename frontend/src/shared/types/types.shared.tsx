export interface SignUpResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}

export interface LoginResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}
export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface RoleData {
  _id: string;
  _name: string;
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

  // mocked
  cardNumber: string;
  cardExpiry: string;
  cardBrand: string;
}
