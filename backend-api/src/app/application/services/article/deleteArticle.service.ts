import { Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteArticleService {
  constructor(
    private readonly repo: ArticleRepository,
    private readonly reviewRepo: ReviewRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository
  ) {}

  async execute(requesterId: string, id: string): Promise<boolean> {
    const article = await this.repo.findById(id);
    if (!article)
      throw new NotFoundException(`Article with ID "${id}" not found`);

    const authors = await this.articleAuthorRepo.findMany(id);

    Article.assertAuthoredBy(
      authors.map((a) => a.userId),
      requesterId
    );

    const reviews = await this.reviewRepo.findMany(id);
    
    if (reviews.length)
      throw new ConflictException(
        'The article is associated with one or more reviews.'
      );

    return await this.repo.delete(id);
  }
}
