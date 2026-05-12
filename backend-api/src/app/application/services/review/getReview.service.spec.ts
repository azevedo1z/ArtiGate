import { GetReviewService } from './getReview.service';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('GetReviewService', () => {
  let service: GetReviewService;
  let adapter: jest.Mocked<ReviewDatabaseAdapter>;

  const reviewRecord = {
    id: 'review-1',
    articleId: 'article-1',
    reviewerId: 'reviewer-1',
    score: 8,
    commentary: 'Good',
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    adapter = {
      findById: jest.fn(),
      findAll: jest.fn(),
      countAll: jest.fn(),
      findManyWithArticleByUserId: jest.fn(),
      findMany: jest.fn(),
    } as any;

    service = new GetReviewService(adapter);
  });

  describe('getById', () => {
    it('should return a review by id as a domain model', async () => {
      adapter.findById.mockResolvedValue(reviewRecord);

      const result = await service.getById('review-1');

      expect(result.id).toBe('review-1');
      expect(result.articleId).toBe('article-1');
      expect(result.reviewerId).toBe('reviewer-1');
      expect(result.score).toBe(8);
      expect(result.commentary).toBe('Good');
    });

    it('should throw NotFoundException if review not found', async () => {
      adapter.findById.mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
    it('should return paginated reviews as domain models', async () => {
      adapter.findAll.mockResolvedValue([reviewRecord]);
      (adapter.countAll as jest.Mock).mockResolvedValue(1);

      const result = await service.getAll();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('review-1');
      expect(result.data[0].score).toBe(8);
      expect(result.meta.total).toBe(1);
    });

    it('should return empty data when no reviews exist', async () => {
      adapter.findAll.mockResolvedValue([]);
      (adapter.countAll as jest.Mock).mockResolvedValue(0);

      const result = await service.getAll();

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('getByReviewerId', () => {
    it('returns reviews with the article summary attached', async () => {
      (adapter.findManyWithArticleByUserId as jest.Mock).mockResolvedValue([
        {
          ...reviewRecord,
          article: { id: 'article-1', summary: 'A paper' },
        },
      ]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toHaveLength(1);
      expect(result[0].reviewerId).toBe('reviewer-1');
      expect(result[0].article).toEqual({ id: 'article-1', summary: 'A paper' });
    });

    it('returns empty array when reviewer has no reviews', async () => {
      (adapter.findManyWithArticleByUserId as jest.Mock).mockResolvedValue([]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toEqual([]);
    });

    it('falls back to empty when the adapter returns undefined', async () => {
      (adapter.findManyWithArticleByUserId as jest.Mock).mockResolvedValue(
        undefined as any,
      );

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toEqual([]);
    });
  });

  describe('getByArticleId', () => {
    it('should return reviews for an article', async () => {
      adapter.findMany.mockResolvedValue([reviewRecord]);

      const result = await service.getByArticleId('article-1');

      expect(result).toHaveLength(1);
      expect(result[0].articleId).toBe('article-1');
    });

    it('should return empty array when article has no reviews', async () => {
      adapter.findMany.mockResolvedValue([]);

      const result = await service.getByArticleId('article-1');

      expect(result).toEqual([]);
    });
  });
});
