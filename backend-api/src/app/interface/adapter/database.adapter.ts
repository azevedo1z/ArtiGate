export abstract class DatabaseAdapter<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(contextParam?: string): Promise<T[]>;

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
