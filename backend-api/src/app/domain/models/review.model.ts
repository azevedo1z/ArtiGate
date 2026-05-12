import { ValidationException } from '../../shared/exceptions/app.exception';

export interface ReviewProps {
  id: string;
  articleId: string;
  reviewerId: string;
  score: number;
  commentary: string;
}

export class Review {
  static readonly MIN_SCORE = 1;
  static readonly MAX_SCORE = 10;

  private _id: string;
  private _articleId: string;
  private _reviewerId: string;
  private _score: number;
  private _commentary: string;

  private constructor(props: ReviewProps) {
    Review.ensureInvariants(props);

    this._id = props.id;
    this._articleId = props.articleId;
    this._reviewerId = props.reviewerId;
    this._score = props.score;
    this._commentary = props.commentary;
  }

  static factory(props: ReviewProps): Review {
    return new Review(props);
  }

  private static ensureInvariants(props: ReviewProps): void {
    const errors: string[] = [];

    if (
      Number.isNaN(props.score) ||
      props.score < Review.MIN_SCORE ||
      props.score > Review.MAX_SCORE
    )
      errors.push(
        `Review score must be between ${Review.MIN_SCORE} and ${Review.MAX_SCORE}.`
      );

    if (!props.commentary?.trim())
      errors.push('Review commentary is required.');

    if (errors.length) throw new ValidationException(errors.join(' '));
  }

  get id(): string {
    return this._id;
  }

  get articleId(): string {
    return this._articleId;
  }

  get reviewerId(): string {
    return this._reviewerId;
  }

  get score(): number {
    return this._score;
  }

  get commentary(): string {
    return this._commentary;
  }
}
