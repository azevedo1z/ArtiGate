export class ArticleAttachment {
  private _id: string;
  private _articleId: string;
  private _storedName: string;
  private _originalName: string;
  private _mimeType: string;
  private _size: number;
  private _checksum: string;
  private _uploaderId: string;

  private constructor(
    id: string,
    articleId: string,
    storedName: string,
    originalName: string,
    mimeType: string,
    size: number,
    checksum: string,
    uploaderId: string
  ) {
    this._id = id;
    this._articleId = articleId;
    this._storedName = storedName;
    this._originalName = originalName;
    this._mimeType = mimeType;
    this._size = size;
    this._checksum = checksum;
    this._uploaderId = uploaderId;
  }

  static factory(
    id: string,
    articleId: string,
    storedName: string,
    originalName: string,
    mimeType: string,
    size: number,
    checksum: string,
    uploaderId: string
  ): ArticleAttachment {
    return new ArticleAttachment(
      id,
      articleId,
      storedName,
      originalName,
      mimeType,
      size,
      checksum,
      uploaderId
    );
  }

  get id(): string {
    return this._id;
  }

  get articleId(): string {
    return this._articleId;
  }

  get storedName(): string {
    return this._storedName;
  }

  get originalName(): string {
    return this._originalName;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get size(): number {
    return this._size;
  }

  get checksum(): string {
    return this._checksum;
  }

  get uploaderId(): string {
    return this._uploaderId;
  }
}
