import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { GetArticleService } from './getArticle.service';
import {
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly articleAuthorAdapter: ArticleAuthorDatabaseAdapter,
    private readonly getArticleService: GetArticleService
  ) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    await this.getArticleService.getById(data.id);

    const articleRecord = await this.adapter.update(data);

    await this.updateArticleAuthor(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }

  private async updateArticleAuthor(data: UpdateArticleDTO) {
    for (const userId of data.authorIds) {
      const articleAuthorData = {
        articleId: data.id,
        userId,
      };

      await this.articleAuthorAdapter.create(articleAuthorData);
    }
  }
}
