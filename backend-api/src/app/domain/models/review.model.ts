export class Review {
  private _id: string;
  private _articleId: string;
  private _reviewerId: string;
  private _score: number;
  private _commentary: string;

  private constructor(
    id: string,
    articleId: string,
    reviewerId: string,
    score: number,
    commentary: string
  ) {
    this._id = id;
    this._articleId = articleId;
    this._reviewerId = reviewerId;
    this._score = score;
    this._commentary = commentary;
  }

  static factory(
    id: string,
    articleId: string,
    reviewerId: string,
    score: number,
    commentary: string
  ): Review {
    return new Review(id, articleId, reviewerId, score, commentary);
  }

  get id(): string {
    return this._id;
  }

  get articleId(): string {
    return this._articleId;
  }

  private set articleId(value: string) {
    this._articleId = value;
  }

  get reviewerId(): string {
    return this._reviewerId;
  }

  private set reviewerId(value: string) {
    this._reviewerId = value;
  }

  get score(): number {
    return this._score;
  }

  private set score(value: number) {
    this._score = value;
  }

  get commentary(): string {
    return this._commentary;
  }

  private set commentary(value: string) {
    this._commentary = value;
  }
}
