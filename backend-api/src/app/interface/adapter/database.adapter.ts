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

  abstract findManyByUserId?(userId: string): Promise<T[]>;
}
