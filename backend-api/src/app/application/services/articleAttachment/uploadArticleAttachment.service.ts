import { Injectable } from '@nestjs/common';
import { ArticleAttachment } from '../../../domain/models/articleAttachment.model';
import { articleAttachmentRowToDomain } from '../../mappers/articleAttachment.mapper';
import {
  ArticleAttachmentDatabaseAdapter,
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { PdfSecurityValidatorService } from '../../../infrastructure/services/pdfSecurityValidator.service';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';
import { PDF_ATTACHMENT } from '../../../shared/constants';

@Injectable()
export class UploadArticleAttachmentService {
  constructor(
    private readonly attachmentAdapter: ArticleAttachmentDatabaseAdapter,
    private readonly articleAdapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly storage: PdfStorageService,
    private readonly validator: PdfSecurityValidatorService
  ) {}

  async execute(
    articleId: string,
    uploaderId: string,
    file: Express.Multer.File
  ): Promise<ArticleAttachment> {
    const validated = this.validator.execute(file);

    const article = await this.articleAdapter.findById(articleId);
    if (!article)
      throw new NotFoundException(
        `Article with ID "${articleId}" was not found.`
      );

    const authors = await this.articleAuthorAdapter.findMany(articleId);
    if (!authors.some((a) => a.userId === uploaderId))
      throw new UnauthorizedException(
        'Only authors of the article can upload its attachment.'
      );

    const existing = await this.attachmentAdapter.findMany(articleId);
    if (existing.length > 0)
      throw new ConflictException(
        'This article already has an attachment. Delete it before uploading a new one.'
      );

    const storedName = this.storage.generateStoredName();

    ArticleAttachment.ensureInvariants({
      id: '',
      articleId,
      storedName,
      originalName: validated.sanitizedName,
      mimeType: PDF_ATTACHMENT.MIME_TYPE,
      size: validated.size,
      checksum: validated.checksum,
      uploaderId,
    });

    await this.storage.write(storedName, validated.buffer);

    try {
      const record = await this.attachmentAdapter.create({
        articleId,
        storedName,
        originalName: validated.sanitizedName,
        mimeType: PDF_ATTACHMENT.MIME_TYPE,
        size: validated.size,
        checksum: validated.checksum,
        uploaderId,
      });

      return articleAttachmentRowToDomain(record);
    } catch (error) {
      await this.storage.delete(storedName);
      throw error;
    }
  }
}
