import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../interface/repositories/user.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly repo: UserRepository,
    private readonly reviewRepo: ReviewRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository
  ) {}

  async execute(id: string): Promise<boolean> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);

    await this.validateConstraints(id);

    await this.repo.delete(id);
    return true;
  }

  private async validateConstraints(id: string) {
    const reviews = await this.reviewRepo.findMany(id);

    const articles = await this.articleAuthorRepo.findManyByUserId(id);

    if (reviews.length)
      throw new ConflictException(
        'The user is associated with one or more reviews.'
      );

    if (articles.length)
      throw new ConflictException(
        'The user is associated with one or more articles.'
      );
  }
}
