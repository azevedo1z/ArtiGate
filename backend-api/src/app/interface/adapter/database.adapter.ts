export abstract class DatabaseAdapter<T> {
  abstract findBy(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract findManyBy(contextParam: string): Promise<T[]>;

  abstract findByName?(name: string): Promise<T | null>;
  abstract findByEmail?(email: string): Promise<T | null>;
  abstract findManyByArticleId?(articleId: string): Promise<T[]>;
  abstract findManyByReviewerId?(reviewerId: string): Promise<T[]>;
  abstract findByReviewId?(reviewId: string): Promise<T | null>;
  abstract findByAddressId?(addressId: string): Promise<T | null>;

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

  abstract delete(id: string): Promise<boolean>;
}
