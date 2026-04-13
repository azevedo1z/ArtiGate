import {
  Address,
  Article,
  ArticleAuthor,
  Review,
  Role,
  User,
  UserRole,
} from '@prisma/client';

export abstract class DatabaseAdapter<T> {
  abstract create(
    data: Partial<T>,
    primaryContextParam?: string,
    secondaryContextParam?: string
  ): Promise<T>;

  abstract update(
    data: Partial<T>,
    primaryContextParam?: string | undefined,
    secondaryContextParam?: string | undefined,
    tertiaryContextParam?: boolean
  ): Promise<T>;

  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract findMany(contextParam: string): Promise<T[]>;

  abstract delete(id: string): Promise<boolean>;

  abstract findByIds?(ids: string[]): Promise<T[]>;
  abstract countByField?(field: string, value: string): Promise<number>;
  abstract findManyByUserId?(userId: string): Promise<T[]>;
  abstract findByName?(name: string): Promise<T | null>;
  abstract findByEmail?(email: string): Promise<T | null>;
  abstract findByAddressId?(addressId: string): Promise<T | null>;
  abstract findByReviewId?(reviewId: string): Promise<T | null>;
}

export abstract class UserDatabaseAdapter extends DatabaseAdapter<User> {}
export abstract class AddressDatabaseAdapter extends DatabaseAdapter<Address> {}
export abstract class RoleDatabaseAdapter extends DatabaseAdapter<Role> {}
export abstract class ArticleDatabaseAdapter extends DatabaseAdapter<Article> {}
export abstract class ReviewDatabaseAdapter extends DatabaseAdapter<Review> {}
export abstract class ArticleAuthorDatabaseAdapter extends DatabaseAdapter<ArticleAuthor> {}
export abstract class UserRoleDatabaseAdapter extends DatabaseAdapter<UserRole> {}
