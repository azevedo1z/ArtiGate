import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateArticleService {
  constructor(private readonly adapter: ArticleDatabaseAdapter) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    const existingArticle = await this.adapter.findById(data.id);
    if (!existingArticle)
      throw new NotFoundException(`Article with ID "${data.id}" not found`);

    const articleRecord = await this.adapter.update(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }
}
