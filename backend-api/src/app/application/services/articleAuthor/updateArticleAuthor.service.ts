import { Injectable } from '@nestjs/common';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';

@Injectable()
export class UpdateArticleAuthorService {
  constructor(private readonly repo: ArticleAuthorRepository) {}

  async execute(data: UpdateArticleDTO) {
    if (!data.authorIds || data.authorIds.length === 0) return;

    for (const userId of data.authorIds) {
      await this.repo.update({ articleId: data.id, userId });
    }
  }
}
