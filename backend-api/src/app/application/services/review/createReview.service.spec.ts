import {
  ValidationException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';
import { CreateReviewService } from './createReview.service';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import {
  ArticleAuthorDatabaseAdapter,
  ReviewDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

describe('CreateReviewService', () => {
  let service: CreateReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  const reviewerId = 'reviewer-1';
  const dto = new CreateReviewDTO('article-1', 8, 'Good article');

  beforeEach(() => {
    reviewAdapter = {
      findMany: jest.fn(),
      createAndRecomputeArticleScore: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      findMany: jest.fn(),
    } as any;

    service = new CreateReviewService(reviewAdapter, articleAuthorAdapter);
  });

  it('writes the review + recomputes the score atomically via the review adapter', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([]);
    (reviewAdapter.createAndRecomputeArticleScore as jest.Mock).mockResolvedValue({
      id: 'review-1',
      articleId: 'article-1',
      reviewerId,
      score: 8,
      commentary: 'Good article',
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });

    const result = await service.execute(reviewerId, dto);

    expect(result.id).toBe('review-1');
    expect(reviewAdapter.createAndRecomputeArticleScore).toHaveBeenCalledWith(
      expect.objectContaining({ reviewerId, articleId: 'article-1', score: 8 }),
      'article-1',
    );
  });

  it('throws ValidationException if author tries to review own article', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      {
        id: 'aa-1',
        articleId: 'article-1',
        userId: reviewerId,
        createdOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      ValidationException,
    );
    expect(reviewAdapter.createAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('throws ConflictException if reviewer already reviewed the article', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([
      {
        id: 'existing-1',
        articleId: 'article-1',
        reviewerId,
        score: 7,
        commentary: 'Already reviewed',
        createdOn: new Date(),
        updatedOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      ConflictException,
    );
    expect(reviewAdapter.createAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
