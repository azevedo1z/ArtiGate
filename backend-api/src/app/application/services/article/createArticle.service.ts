import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { DatabaseAdapter } from '../../../interface/adapter/database.adapter';

@Injectable()
export class CreateArticleService {
  constructor(private readonly adapter: DatabaseAdapter<Article>) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    const articleRecord = await this.adapter.create(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
