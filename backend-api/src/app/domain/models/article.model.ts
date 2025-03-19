export class Article {
  private _id: string;

  private _summary: string;

  private _scoreAvg: number;

  private constructor(id: string, summary: string, scoreAvg: number) {
    this._id = id;
    this._summary = summary;
    this._scoreAvg = scoreAvg;
  }

  static factory(id: string, summary: string, scoreAvg: number): Article {
    return new Article(id, summary, scoreAvg);
  }

  get summary(): string {
    return this._summary;
  }

  private set summary(value: string) {
    this._summary = value;
  }

  get scoreAvg(): number {
    return this._scoreAvg;
  }

  private set scoreAvg(value: number) {
    this._scoreAvg = value;
  }

  get id(): string {
    return this._id;
  }
}
