import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleAttachment } from '../../../domain/models/articleAttachment.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { ArticleAttachmentRepository } from '../../../interface/repositories/articleAttachment.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { PdfSecurityValidatorService } from '../../../infrastructure/services/pdfSecurityValidator.service';
import { PdfStorageService } from '../../../infrastructure/services/pdfStorage.service';
import {
  ConflictException,
  NotFoundException,
} from '../../../shared/exceptions/app.exception';
import { PDF_ATTACHMENT } from '../../../shared/constants';

@Injectable()
export class UploadArticleAttachmentService {
  constructor(
    private readonly attachmentRepo: ArticleAttachmentRepository,
    private readonly articleRepo: ArticleRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository,
    private readonly storage: PdfStorageService,
    private readonly validator: PdfSecurityValidatorService
  ) {}

  async execute(
    articleId: string,
    uploaderId: string,
    file: Express.Multer.File
  ): Promise<ArticleAttachment> {
    const validated = this.validator.execute(file);

    const article = await this.articleRepo.findById(articleId);
    if (!article)
      throw new NotFoundException(
        `Article with ID "${articleId}" was not found.`
      );

    const authors = await this.articleAuthorRepo.findMany(articleId);
    Article.assertAuthoredBy(
      authors.map((a) => a.userId),
      uploaderId
    );

    const existing = await this.attachmentRepo.findMany(articleId);
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
      return await this.attachmentRepo.create({
        articleId,
        storedName,
        originalName: validated.sanitizedName,
        mimeType: PDF_ATTACHMENT.MIME_TYPE,
        size: validated.size,
        checksum: validated.checksum,
        uploaderId,
      });
    } catch (error) {
      await this.storage.delete(storedName);
      throw error;
    }
  }
}
