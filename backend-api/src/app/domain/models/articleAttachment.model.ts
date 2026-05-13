import { ValidationException } from '../../shared/exceptions/app.exception';

export interface ArticleAttachmentProps {
  id: string;
  articleId: string;
  storedName: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
  uploaderId: string;
}

export class ArticleAttachment {
  private _id: string;
  private _articleId: string;
  private _storedName: string;
  private _originalName: string;
  private _mimeType: string;
  private _size: number;
  private _checksum: string;
  private _uploaderId: string;

  private constructor(props: ArticleAttachmentProps) {
    ArticleAttachment.ensureInvariants(props);

    this._id = props.id;
    this._articleId = props.articleId;
    this._storedName = props.storedName;
    this._originalName = props.originalName;
    this._mimeType = props.mimeType;
    this._size = props.size;
    this._checksum = props.checksum;
    this._uploaderId = props.uploaderId;
  }

  static factory(props: ArticleAttachmentProps): ArticleAttachment {
    return new ArticleAttachment(props);
  }

  static ensureInvariants(props: ArticleAttachmentProps): void {
    const errors: string[] = [];

    if (props.size <= 0)
      errors.push('Article attachment size must be positive.');

    if (!props.checksum?.trim())
      errors.push('Article attachment checksum is required.');

    if (errors.length) throw new ValidationException(errors.join(' '));
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
