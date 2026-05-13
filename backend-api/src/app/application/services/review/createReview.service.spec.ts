import {
  ValidationException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';
import { CreateReviewService } from './createReview.service';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';

describe('CreateReviewService', () => {
  let service: CreateReviewService;
  let reviewRepo: jest.Mocked<ReviewRepository>;
  let articleAuthorRepo: jest.Mocked<ArticleAuthorRepository>;

  const reviewerId = 'reviewer-1';
  const dto = new CreateReviewDTO('article-1', 8, 'Good article');

  beforeEach(() => {
    reviewRepo = {
      findMany: jest.fn(),
      createAndRecomputeArticleScore: jest.fn(),
    } as any;

    articleAuthorRepo = {
      findMany: jest.fn(),
    } as any;

    service = new CreateReviewService(reviewRepo, articleAuthorRepo);
  });

  it('writes the review + recomputes the score atomically via the review adapter', async () => {
    articleAuthorRepo.findMany.mockResolvedValue([]);
    reviewRepo.findMany.mockResolvedValue([]);
    (reviewRepo.createAndRecomputeArticleScore as jest.Mock).mockResolvedValue(
      Review.factory({
        id: 'review-1',
        articleId: 'article-1',
        reviewerId,
        score: 8,
        commentary: 'Good article',
      })
    );

    const result = await service.execute(reviewerId, dto);

    expect(result.id).toBe('review-1');
    expect(reviewRepo.createAndRecomputeArticleScore).toHaveBeenCalledWith(
      expect.objectContaining({ reviewerId, articleId: 'article-1', score: 8 }),
      'article-1',
    );
  });

  it('throws ValidationException if author tries to review own article', async () => {
    articleAuthorRepo.findMany.mockResolvedValue([
      {
        id: 'aa-1',
        articleId: 'article-1',
        userId: reviewerId,
      },
    ]);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      ValidationException,
    );
    expect(reviewRepo.createAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('throws ConflictException if reviewer already reviewed the article', async () => {
    articleAuthorRepo.findMany.mockResolvedValue([]);
    reviewRepo.findMany.mockResolvedValue([
      Review.factory({
        id: 'existing-1',
        articleId: 'article-1',
        reviewerId,
        score: 7,
        commentary: 'Already reviewed',
      }),
    ]);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      ConflictException,
    );
    expect(reviewRepo.createAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
