import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleAttachmentRepository } from '../../../interface/repositories/articleAttachment.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteArticleAttachmentService {
  constructor(
    private readonly attachmentRepo: ArticleAttachmentRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository,
    private readonly storage: PdfStorageService
  ) {}

  async execute(attachmentId: string, requesterId: string): Promise<boolean> {
    const attachment = await this.attachmentRepo.findById(attachmentId);
    if (!attachment)
      throw new NotFoundException(
        `Attachment with ID "${attachmentId}" was not found.`
      );

    const authors = await this.articleAuthorRepo.findMany(attachment.articleId);
    Article.assertAuthoredBy(
      authors.map((a) => a.userId),
      requesterId
    );

    await this.attachmentRepo.delete(attachmentId);
    await this.storage.delete(attachment.storedName);

    return true;
  }
}
