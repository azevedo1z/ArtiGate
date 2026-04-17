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
      findManyByUserId: jest.fn(),
      findMany: jest.fn(),
    } as any;

    service = new GetReviewService(adapter);
  });

  describe('getById', () => {
    it('should return a review by id', async () => {
      adapter.findById.mockResolvedValue(reviewRecord);

      const result = await service.getById('review-1');

      expect(result).toEqual(reviewRecord);
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
    it('should return reviews for a reviewer', async () => {
      adapter.findManyByUserId?.mockResolvedValue([reviewRecord]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toHaveLength(1);
      expect(result[0].reviewerId).toBe('reviewer-1');
    });

    it('should return empty array when reviewer has no reviews', async () => {
      adapter.findManyByUserId?.mockResolvedValue([]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toEqual([]);
    });

    it('should return empty array when findManyByUserId returns undefined', async () => {
      adapter.findManyByUserId?.mockResolvedValue(undefined as any);

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
