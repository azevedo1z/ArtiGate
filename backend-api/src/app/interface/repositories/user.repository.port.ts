import { User } from '../../domain/models/user.model';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';

export interface CreateUserPersistenceInput {
  name: string;
  email: string;
  phone: string;
  badgeUrl: string;
  passwordHash: string;
  homeAddressId: string;
  jobAddressId: string;
  roleIds: string[];
}

export interface UpdateUserPersistenceInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  badgeUrl?: string;
  passwordHash?: string;
  homeAddressId?: string;
  jobAddressId?: string;
  roleIds?: string[];
}

export abstract class UserRepository {
  abstract create(input: CreateUserPersistenceInput): Promise<User>;
  abstract update(input: UpdateUserPersistenceInput): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(pagination?: PaginationDTO): Promise<User[]>;
  abstract countAll(): Promise<number>;
  abstract findByIds(ids: string[]): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByAddressId(addressId: string): Promise<User | null>;
}
