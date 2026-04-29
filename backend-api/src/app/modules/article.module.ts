import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ArticleController } from '../interface/controllers/article.controller';
import { ArticleRepository } from '../infrastructure/repositories/article.repository';
import { ArticleAuthorRepository } from '../infrastructure/repositories/articleAuthor.repository';
import { ArticleAttachmentRepository } from '../infrastructure/repositories/articleAttachment.repository';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
  ArticleAttachmentDatabaseAdapter,
} from '../interface/adapter/database.adapter';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { SubmitArticleService } from '../application/services/article/submitArticle.service';
import { GetArticleService } from '../application/services/article/getArticle.service';
import { UpdateArticleService } from '../application/services/article/updateArticle.service';
import { DeleteArticleService } from '../application/services/article/deleteArticle.service';
import { CreateArticleAuthorService } from '../application/services/articleAuthor/createArticleAuthor.service';
import { GetArticleAuthorService } from '../application/services/articleAuthor/getArticleAuthor.service';
import { UpdateArticleAuthorService } from '../application/services/articleAuthor/updateArticleAuthor.service';
import { UploadArticleAttachmentService } from '../application/services/articleAttachment/uploadArticleAttachment.service';
import { DownloadArticleAttachmentService } from '../application/services/articleAttachment/downloadArticleAttachment.service';
import { DeleteArticleAttachmentService } from '../application/services/articleAttachment/deleteArticleAttachment.service';
import { PdfStorageService } from '../infrastructure/services/pdfStorage.service';
import { PdfSecurityValidatorService } from '../infrastructure/services/pdfSecurityValidator.service';
import { ValidationException } from '../shared/exceptions/app.exception';
import { PDF_ATTACHMENT } from '../shared/constants';
import { ReviewModule } from './review.module';
import { RoleModule } from './role.module';

@Module({
  imports: [
    forwardRef(() => ReviewModule),
    RoleModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: memoryStorage(),
        limits: {
          fileSize: configService.getOrThrow<number>('attachments.maxBytes'),
          files: 1,
          fields: 10,
          parts: 11,
          headerPairs: 50,
        },
        fileFilter: (_req, file, cb) => {
          if (file.mimetype !== PDF_ATTACHMENT.MIME_TYPE) {
            cb(new ValidationException('Only PDF files are accepted.'), false);
            return;
          }
          cb(null, true);
        },
      }),
    }),
  ],
  controllers: [ArticleController],
  providers: [
    CreateArticleService,
    SubmitArticleService,
    GetArticleService,
    UpdateArticleService,
    DeleteArticleService,
    CreateArticleAuthorService,
    GetArticleAuthorService,
    UpdateArticleAuthorService,
    UploadArticleAttachmentService,
    DownloadArticleAttachmentService,
    DeleteArticleAttachmentService,
    PdfStorageService,
    PdfSecurityValidatorService,
    {
      provide: ArticleDatabaseAdapter,
      useClass: ArticleRepository,
    },
    {
      provide: ArticleAuthorDatabaseAdapter,
      useClass: ArticleAuthorRepository,
    },
    {
      provide: ArticleAttachmentDatabaseAdapter,
      useClass: ArticleAttachmentRepository,
    },
  ],
  exports: [
    ArticleDatabaseAdapter,
    ArticleAuthorDatabaseAdapter,
    ArticleAttachmentDatabaseAdapter,
  ],
})
export class ArticleModule {}
