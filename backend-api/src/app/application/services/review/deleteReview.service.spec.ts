import { DeleteReviewService } from './deleteReview.service';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DeleteReviewService', () => {
  let service: DeleteReviewService;
  let reviewRepo: jest.Mocked<ReviewRepository>;

  const reviewerId = 'reviewer-1';
  const reviewRecord = Review.factory({
    id: 'review-1',
    articleId: 'article-1',
    reviewerId,
    score: 8,
    commentary: 'Good',
  });

  beforeEach(() => {
    reviewRepo = {
      findById: jest.fn(),
      deleteAndRecomputeArticleScore: jest.fn(),
    } as any;

    service = new DeleteReviewService(reviewRepo);
  });

  it('delegates the soft-delete + score recompute to the review adapter', async () => {
    reviewRepo.findById.mockResolvedValue(reviewRecord);
    (reviewRepo.deleteAndRecomputeArticleScore as jest.Mock).mockResolvedValue(
      true,
    );

    const result = await service.execute(reviewerId, 'review-1');

    expect(result).toBe(true);
    expect(reviewRepo.deleteAndRecomputeArticleScore).toHaveBeenCalledWith(
      'review-1',
      'article-1',
    );
  });

  it('throws NotFoundException if review does not exist', async () => {
    reviewRepo.findById.mockResolvedValue(null);

    await expect(service.execute(reviewerId, 'nonexistent')).rejects.toThrow(
      NotFoundException,
    );
    expect(reviewRepo.deleteAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when a non-owner tries to delete', async () => {
    reviewRepo.findById.mockResolvedValue(reviewRecord);

    await expect(service.execute('someone-else', 'review-1')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(reviewRepo.deleteAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
