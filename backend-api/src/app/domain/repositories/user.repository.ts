import { User, UserRole } from '@prisma/client';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(
    data: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract findAllRoles(): Promise<UserRole[]>;
  abstract findRolesByAuthorId(userId: string): Promise<UserRole[]>;
}
