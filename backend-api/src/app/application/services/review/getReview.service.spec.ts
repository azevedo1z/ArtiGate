import { GetReviewService } from './getReview.service';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('GetReviewService', () => {
  let service: GetReviewService;
  let repo: jest.Mocked<ReviewRepository>;

  const reviewRecord = Review.factory({
    id: 'review-1',
    articleId: 'article-1',
    reviewerId: 'reviewer-1',
    score: 8,
    commentary: 'Good',
  });

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      countAll: jest.fn(),
      findManyWithArticleByUserId: jest.fn(),
      findMany: jest.fn(),
    } as any;

    service = new GetReviewService(repo);
  });

  describe('getById', () => {
    it('should return a review by id as a domain model', async () => {
      repo.findById.mockResolvedValue(reviewRecord);

      const result = await service.getById('review-1');

      expect(result.id).toBe('review-1');
      expect(result.articleId).toBe('article-1');
      expect(result.reviewerId).toBe('reviewer-1');
      expect(result.score).toBe(8);
      expect(result.commentary).toBe('Good');
    });

    it('should throw NotFoundException if review not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
    it('should return paginated reviews as domain models', async () => {
      repo.findAll.mockResolvedValue([reviewRecord]);
      (repo.countAll as jest.Mock).mockResolvedValue(1);

      const result = await service.getAll();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('review-1');
      expect(result.data[0].score).toBe(8);
      expect(result.meta.total).toBe(1);
    });

    it('should return empty data when no reviews exist', async () => {
      repo.findAll.mockResolvedValue([]);
      (repo.countAll as jest.Mock).mockResolvedValue(0);

      const result = await service.getAll();

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('getByReviewerId', () => {
    it('returns reviews with the article summary attached', async () => {
      (repo.findManyWithArticleByUserId as jest.Mock).mockResolvedValue([
        {
          id: 'review-1',
          articleId: 'article-1',
          reviewerId: 'reviewer-1',
          score: 8,
          commentary: 'Good',
          article: { id: 'article-1', summary: 'A research paper' },
        },
      ]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toHaveLength(1);
      expect(result[0].reviewerId).toBe('reviewer-1');
      expect(result[0].article).toEqual({
        id: 'article-1',
        summary: 'A research paper',
      });
    });

    it('returns empty array when reviewer has no reviews', async () => {
      (repo.findManyWithArticleByUserId as jest.Mock).mockResolvedValue([]);

      const result = await service.getByReviewerId('reviewer-1');

      expect(result).toEqual([]);
    });
  });

  describe('getByArticleId', () => {
    it('should return reviews for an article', async () => {
      repo.findMany.mockResolvedValue([reviewRecord]);

      const result = await service.getByArticleId('article-1');

      expect(result).toHaveLength(1);
      expect(result[0].articleId).toBe('article-1');
    });

    it('should return empty array when article has no reviews', async () => {
      repo.findMany.mockResolvedValue([]);

      const result = await service.getByArticleId('article-1');

      expect(result).toEqual([]);
    });
  });
});
