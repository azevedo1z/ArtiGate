import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';

@Injectable()
export class CreateArticleService {
  constructor(
    private readonly repo: ArticleRepository,
    private readonly ensureAuthorsExistService: EnsureAuthorsExistService
  ) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    Article.assertAuthorCount(data.authorIds);
    Article.ensureInvariants({ id: '', summary: data.summary, scoreAvg: 0 });

    await this.ensureAuthorsExistService.execute(data.authorIds);

    return this.repo.create(data);
  }
}
