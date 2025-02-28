
export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
  homeAddressId: string;
  jobAddressId: string;
  badgeUrl: string;
  role: 'AUTHOR' | 'REVIEWER';
}