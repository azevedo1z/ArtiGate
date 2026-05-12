import { ValidationException } from '../../shared/exceptions/app.exception';

export interface ArticleProps {
  id: string;
  summary: string;
  scoreAvg: number;
}

export class Article {
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

    if (!props.summary?.trim()) errors.push('Article summary is required.');

    if (
      Number.isNaN(props.scoreAvg) ||
      props.scoreAvg < 0 ||
      props.scoreAvg > 10
    )
      errors.push('Article score average must be a number between 0 and 10.');

    if (errors.length) throw new ValidationException(errors.join(' '));
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
