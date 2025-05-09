import { ArticleAuthor, User, UserRole } from '@prisma/client';
import { CreateUserDTO } from '../../application/dtos/user/createUser.dto';
import { UpdateUserDTO } from '../../application/dtos/user/updateUser.dto';

export abstract class UserRepository {
  abstract create(
    data: CreateUserDTO,
    homeAddressId: string,
    jobAddressId: string
  ): Promise<User>;

  abstract update(
    data: UpdateUserDTO,
    homeAddressId: string | null,
    jobAddressId: string | null,
    roleChanged: boolean
  ): Promise<User>;

  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract findAllRoles(): Promise<UserRole[]>;
  abstract findRolesByAuthorId(userId: string): Promise<UserRole[]>;
  abstract findByAddressId(addressId: string): Promise<User[]>;
  abstract findByArticleId(articleId: string): Promise<ArticleAuthor[]>;
  abstract findByReviewId(reviewId: string): Promise<User[]>;
}
