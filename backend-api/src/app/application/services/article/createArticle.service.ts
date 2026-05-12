import { Injectable } from '@nestjs/common';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { articleRowToDomain } from '../../mappers/article.mapper';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';

@Injectable()
export class CreateArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly ensureAuthorsExistService: EnsureAuthorsExistService
  ) {}

  async execute(data: CreateArticleDTO): Promise<Article> {
    await this.ensureAuthorsExistService.execute(data.authorIds);

    const articleRecord = await this.adapter.create(data);

    return articleRowToDomain(articleRecord);
  }
}
