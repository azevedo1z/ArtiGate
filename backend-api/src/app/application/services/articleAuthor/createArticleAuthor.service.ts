import { Injectable } from '@nestjs/common';
import { ArticleAuthorDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';

@Injectable()
export class CreateArticleAuthorService {
  constructor(private readonly adapter: ArticleAuthorDatabaseAdapter) {}

  async execute(data: CreateArticleDTO, articleId: string) {
    for (const userId of data.authorIds) {
      const articleAuthorData = {
        articleId,
        userId,
      };

      await this.adapter.create(articleAuthorData);
    }
  }
}
