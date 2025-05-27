import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { ArticleAuthorDatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter
  ) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    const articleRecord = await this.adapter.create(data);

    await this.createArticleAuthor(data, articleRecord.id);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }

  private async createArticleAuthor(data: CreateArticleDTO, articleId: string) {
    for (const userId of data.authorIds) {
      const articleAuthorData = {
        articleId,
        userId,
      };

      await this.articleAuthorAdapter.create(articleAuthorData);
    }
  }
}
