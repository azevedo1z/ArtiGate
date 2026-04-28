import { Injectable } from '@nestjs/common';
import {
  ArticleAttachmentDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteArticleAttachmentService {
  constructor(
    private readonly attachmentAdapter: ArticleAttachmentDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly storage: PdfStorageService
  ) {}

  async execute(attachmentId: string, requesterId: string): Promise<boolean> {
    const attachment = await this.attachmentAdapter.findById(attachmentId);
    if (!attachment)
      throw new NotFoundException(
        `Attachment with ID "${attachmentId}" was not found.`
      );

    const authors = await this.articleAuthorAdapter.findMany(
      attachment.articleId
    );
    if (!authors.some((a) => a.userId === requesterId))
      throw new UnauthorizedException(
        'Only authors of the article can delete its attachment.'
      );

    await this.attachmentAdapter.delete(attachmentId);
    await this.storage.delete(attachment.storedName);

    return true;
  }
}
