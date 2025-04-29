import { BadRequestException, Injectable } from '@nestjs/common';
import { ArticleRepository } from '../../../domain/repositories/article.repository';
import { GetArticleService } from './getArticle.service';
import { GetUserService } from '../user/getUser.service';

@Injectable()
export class DeleteArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly getArticleService: GetArticleService,
    private readonly getUserService: GetUserService
  ) {}

  async execute(id: string): Promise<boolean> {
    await this.getArticleService.getById(id);

    const authors = await this.getUserService.getByArticleId(id);

    const hasConstraint =
      authors?.some((author) => author.articleId === id) ?? false;

    if (hasConstraint)
      throw new BadRequestException('The article is associated with a user.');

    return await this.articleRepository.delete(id);
  }
}
