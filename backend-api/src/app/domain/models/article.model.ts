import {
  UnauthorizedException,
  ValidationException,
} from '../../shared/exceptions/app.exception';

export interface ArticleProps {
  id: string;
  summary: string;
  scoreAvg: number;
}

export class Article {
  static readonly MIN_AUTHORS = 1;
  static readonly MAX_AUTHORS = 3;

  private _id: string;
  private _summary: string;
  private _scoreAvg: number;

  private constructor(props: ArticleProps) {
    Article.ensureInvariants(props);

    this._id = props.id;
    this._summary = props.summary;
    this._scoreAvg = props.scoreAvg;
  }

  static factory(props: ArticleProps): Article {
    return new Article(props);
  }

  static ensureInvariants(props: ArticleProps): void {
    const errors: string[] = [];

    if (
      Number.isNaN(props.scoreAvg) ||
      props.scoreAvg < 0 ||
      props.scoreAvg > 10
    )
      errors.push('Article score average must be a number between 0 and 10.');

    if (errors.length) throw new ValidationException(errors.join(' '));
  }

  static assertAuthorCount(authorIds: string[]): void {
    if (
      authorIds.length < Article.MIN_AUTHORS ||
      authorIds.length > Article.MAX_AUTHORS
    )
      throw new ValidationException(
        `An article must have between ${Article.MIN_AUTHORS} and ${Article.MAX_AUTHORS} authors.`
      );
  }

  static assertAuthoredBy(authorIds: string[], userId: string): void {
    if (!authorIds.includes(userId))
      throw new UnauthorizedException(
        'Only authors of this article are allowed to perform this action.'
      );
  }

  get summary(): string {
    return this._summary;
  }

  get scoreAvg(): number {
    return this._scoreAvg;
  }

  get id(): string {
    return this._id;
  }
}
