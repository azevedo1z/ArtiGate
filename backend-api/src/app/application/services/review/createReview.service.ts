import { Injectable } from '@nestjs/common';
import { ConflictException } from '../../../shared/exceptions/app.exception';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';

@Injectable()
export class CreateReviewService {
  constructor(
    private readonly repo: ReviewRepository,
    private readonly articleAuthorRepo: ArticleAuthorRepository
  ) {}

  async execute(requesterId: string, data: CreateReviewDTO): Promise<Review> {
    const authors = await this.articleAuthorRepo.findMany(data.articleId);
    Review.assertReviewerIsNotAuthor(
      authors.map((a) => a.userId),
      requesterId
    );

    const existingReviews = await this.repo.findMany(data.articleId);

    if (existingReviews.some((r) => r.reviewerId === requesterId))
      throw new ConflictException('You have already reviewed this article');

    Review.ensureInvariants({
      id: '',
      articleId: data.articleId,
      reviewerId: requesterId,
      score: data.score,
      commentary: data.commentary,
    });

    return this.repo.createAndRecomputeArticleScore(
      { ...data, reviewerId: requesterId },
      data.articleId
    );
  }
}
