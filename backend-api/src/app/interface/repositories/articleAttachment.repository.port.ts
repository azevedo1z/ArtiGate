import { ArticleAttachment } from '../../domain/models/articleAttachment.model';

export interface CreateArticleAttachmentInput {
  articleId: string;
  storedName: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
  uploaderId: string;
}

export abstract class ArticleAttachmentRepository {
  abstract create(data: CreateArticleAttachmentInput): Promise<ArticleAttachment>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<ArticleAttachment | null>;
  abstract findMany(articleId: string): Promise<ArticleAttachment[]>;
}
