import {
  ValidationException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';
import { CreateReviewService } from './createReview.service';
import { CreateReviewDTO } from '../../dtos/review/createReview.dto';
import {
  ReviewDatabaseAdapter,
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

describe('CreateReviewService', () => {
  let service: CreateReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  beforeEach(() => {
    reviewAdapter = {
      findMany: jest.fn(),
      create: jest.fn(),
    } as any;

    articleAdapter = {
      update: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      findMany: jest.fn(),
    } as any;

    service = new CreateReviewService(
      reviewAdapter,
      articleAdapter,
      articleAuthorAdapter,
    );
  });

  const dto = new CreateReviewDTO('article-1', 'reviewer-1', 8, 'Good article');

  it('should create a review and calculate scoreAvg', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.create.mockResolvedValue({
      id: 'review-1',
      articleId: 'article-1',
      reviewerId: 'reviewer-1',
      score: 8,
      commentary: 'Good article',
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });

    const result = await service.execute(dto);

    expect(result.id).toBe('review-1');
    expect(result.score).toBe(8);
    expect(articleAdapter.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'article-1', scoreAvg: 8 }),
    );
  });

  it('should calculate average score with existing reviews', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([
      {
        id: 'existing-1',
        articleId: 'article-1',
        reviewerId: 'other-reviewer',
        score: 6,
        commentary: 'OK',
        createdOn: new Date(),
        updatedOn: new Date(),
        deletedOn: null,
      },
    ]);
    reviewAdapter.create.mockResolvedValue({
      id: 'review-2',
      articleId: 'article-1',
      reviewerId: 'reviewer-1',
      score: 8,
      commentary: 'Good article',
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });

    await service.execute(dto);

    expect(articleAdapter.update).toHaveBeenCalledWith(
      expect.objectContaining({ scoreAvg: 7 }),
    );
  });

  it('should throw ValidationException if author tries to review own article', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([
      {
        id: 'aa-1',
        articleId: 'article-1',
        userId: 'reviewer-1',
        createdOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute(dto)).rejects.toThrow(ValidationException);
  });

  it('should throw ConflictException if reviewer already reviewed the article', async () => {
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([
      {
        id: 'existing-1',
        articleId: 'article-1',
        reviewerId: 'reviewer-1',
        score: 7,
        commentary: 'Already reviewed',
        createdOn: new Date(),
        updatedOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute(dto)).rejects.toThrow(ConflictException);
  });
});
