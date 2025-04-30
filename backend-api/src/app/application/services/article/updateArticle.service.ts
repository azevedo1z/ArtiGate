import { Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain/repositories/article.repository';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { GetArticleService } from './getArticle.service';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly getArticleService: GetArticleService
  ) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    await this.getArticleService.getById(data.id);

    const articleRecord = await this.repository.update(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
