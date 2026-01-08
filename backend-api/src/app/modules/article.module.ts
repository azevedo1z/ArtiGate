import { Module } from '@nestjs/common';
import { ArticleController } from '../interface/controllers/article.controller';
import { ArticleRepository } from '../infrastructure/repositories/article.repository';
import { ArticleAuthorRepository } from '../infrastructure/repositories/articleAuthor.repository';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../interface/adapter/database.adapter';
import { CreateArticleService } from '../application/services/article/createArticle.service';
import { GetArticleService } from '../application/services/article/getArticle.service';
import { UpdateArticleService } from '../application/services/article/updateArticle.service';
import { DeleteArticleService } from '../application/services/article/deleteArticle.service';
import { CreateArticleAuthorService } from '../application/services/articleAuthor/createArticleAuthor.service';
import { GetArticleAuthorService } from '../application/services/articleAuthor/getArticleAuthor.service';
import { UpdateArticleAuthorService } from '../application/services/articleAuthor/updateArticleAuthor.service';
import { ReviewModule } from './review.module';

@Module({
  imports: [ReviewModule],
  controllers: [ArticleController],
  providers: [
    CreateArticleService,
    GetArticleService,
    UpdateArticleService,
    DeleteArticleService,
    CreateArticleAuthorService,
    GetArticleAuthorService,
    UpdateArticleAuthorService,
    {
      provide: ArticleDatabaseAdapter,
      useClass: ArticleRepository,
    },
    {
      provide: ArticleAuthorDatabaseAdapter,
      useClass: ArticleAuthorRepository,
    },
  ],
  exports: [ArticleDatabaseAdapter, ArticleAuthorDatabaseAdapter],
})
export class ArticleModule {}
