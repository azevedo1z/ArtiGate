import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { GetArticleService } from './getArticle.service';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: DatabaseAdapter<Article>,
    private readonly getArticleService: GetArticleService
  ) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    await this.getArticleService.getById(data.id);

    const articleRecord = await this.adapter.update(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
