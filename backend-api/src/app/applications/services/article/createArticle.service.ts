import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { ArticleRepository } from '../../../domain/repositories/article.repository';
import { Article } from '../../../domain/models/article.model';

@Injectable()
export class CreateArticleService {
  constructor(private readonly repository: ArticleRepository) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    const articleRecord = await this.repository.create(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
