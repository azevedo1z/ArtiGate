import { Injectable, Logger } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleAttachment } from '../../../domain/models/articleAttachment.model';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { CreateArticleService } from './createArticle.service';
import { UploadArticleAttachmentService } from '../articleAttachment/uploadArticleAttachment.service';
import { PdfSecurityValidatorService } from '../../../infrastructure/services/pdfSecurityValidator.service';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

export interface SubmitArticleResult {
  article: Article;
  attachment: ArticleAttachment;
}

@Injectable()
export class SubmitArticleService {
  private readonly logger = new Logger(SubmitArticleService.name);

  constructor(
    private readonly validator: PdfSecurityValidatorService,
    private readonly createArticleService: CreateArticleService,
    private readonly uploadAttachmentService: UploadArticleAttachmentService,
    private readonly articleAdapter: ArticleDatabaseAdapter
  ) {}

  async execute(
    data: CreateArticleDTO,
    requesterId: string,
    file: Express.Multer.File
  ): Promise<SubmitArticleResult> {
    if (!file) throw new ValidationException('A PDF attachment is required.');

    Article.assertAuthoredBy(data.authorIds, requesterId);

    this.validator.execute(file);

    const article = await this.createArticleService.execute(data);

    try {
      const attachment = await this.uploadAttachmentService.execute(
        article.id,
        requesterId,
        file
      );
      return { article, attachment };
    } catch (error) {
      await this.rollbackCreation(article.id);
      throw error;
    }
  }

  private async rollbackCreation(articleId: string): Promise<void> {
    try {
      await this.articleAdapter.delete(articleId);
    } catch (rollbackError) {
      this.logger.error(
        `Failed to roll back article "${articleId}" after attachment failure.`,
        (rollbackError as Error).stack
      );
    }
  }
}
