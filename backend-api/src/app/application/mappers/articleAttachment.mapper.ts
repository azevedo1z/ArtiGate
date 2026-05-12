import { ArticleAttachment as ArticleAttachmentRow } from '@prisma/client';
import { ArticleAttachment } from '../../domain/models/articleAttachment.model';

export const articleAttachmentRowToDomain = (
  row: ArticleAttachmentRow
): ArticleAttachment =>
  ArticleAttachment.factory({
    id: row.id,
    articleId: row.articleId,
    storedName: row.storedName,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    checksum: row.checksum,
    uploaderId: row.uploaderId,
  });
