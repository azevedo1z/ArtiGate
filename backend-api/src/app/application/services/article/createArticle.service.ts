import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { CreateArticleAuthorService } from '../articleAuthor/createArticleAuthor.service';

@Injectable()
export class CreateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly createArticleAuthorService: CreateArticleAuthorService
  ) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    const articleRecord = await this.adapter.create(data);

    await this.createArticleAuthorService.execute(data, articleRecord.id);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
