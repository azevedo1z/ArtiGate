import { ArticleAuthorDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';

export class UpdateArticleAuthorService {
  constructor(private readonly adapter: ArticleAuthorDatabaseAdapter) {}

  async execute(data: UpdateArticleDTO) {
    for (const userId of data.authorIds) {
      const articleAuthorData = {
        articleId: data.id,
        userId,
      };

      await this.adapter.update(articleAuthorData);
    }
  }
}
