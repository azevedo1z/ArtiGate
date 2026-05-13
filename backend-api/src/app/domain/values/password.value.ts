import { ValidationException } from '../../shared/exceptions/app.exception';

export class Password {
  static readonly MIN_LENGTH = 8;

  private constructor(private readonly _value: string) {}

  static fromPlaintext(raw: string): Password {
    if (!raw || raw.length < Password.MIN_LENGTH)
      throw new ValidationException(
        `Password must be at least ${Password.MIN_LENGTH} characters.`
      );
    return new Password(raw);
  }

  get value(): string {
    return this._value;
  }
}
