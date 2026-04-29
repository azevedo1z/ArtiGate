import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ValidationException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class UpdateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly userAdapter: UserDatabaseAdapter
  ) {}

  async execute(data: UpdateArticleDTO): Promise<Article> {
    const existingArticle = await this.adapter.findById(data.id);
    if (!existingArticle)
      throw new NotFoundException(`Article with ID "${data.id}" not found`);

    await this.ensureIsUser(data.authorIds);

    const articleRecord = await this.adapter.update(data);

    return Article.factory(
      articleRecord.id,
      articleRecord.summary,
      articleRecord.scoreAvg
    );
  }

  private async ensureIsUser(authorIds: string[] | undefined): Promise<void> {
    if (!authorIds) return;

    for (const userId of authorIds) {
      const user = await this.userAdapter.findById(userId);
      if (!user)
        throw new ValidationException(`The author "${userId}" is not registered in the system.`);
    }
  }
}
