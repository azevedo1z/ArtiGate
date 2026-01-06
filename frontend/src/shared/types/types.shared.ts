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
