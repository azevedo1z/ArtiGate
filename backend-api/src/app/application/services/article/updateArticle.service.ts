import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { GetArticleService } from './getArticle.service';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { UpdateArticleAuthorService } from '../articleAuthor/updateArticleAuthor.service';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly getArticleService: GetArticleService,
    private readonly updateArticleAuthorService: UpdateArticleAuthorService
  ) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    await this.getArticleService.getById(data.id);

    const articleRecord = await this.adapter.update(data);

    if (data.authorIds?.length)
      await this.updateArticleAuthorService.execute(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
