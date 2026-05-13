import { Injectable } from '@nestjs/common';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';

@Injectable()
export class CreateArticleAuthorService {
  constructor(private readonly repo: ArticleAuthorRepository) {}

  async execute(data: CreateArticleDTO, articleId: string) {
    for (const userId of data.authorIds) {
      await this.repo.create({ articleId, userId });
    }
  }
}
