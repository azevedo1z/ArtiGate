import { UpdateReviewService } from './updateReview.service';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { Review } from '../../../domain/models/review.model';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('UpdateReviewService', () => {
  let service: UpdateReviewService;
  let reviewRepo: jest.Mocked<ReviewRepository>;

  const reviewerId = 'reviewer-1';
  const reviewRecord = Review.factory({
    id: 'review-1',
    articleId: 'article-1',
    reviewerId,
    score: 9,
    commentary: 'Updated',
  });

  beforeEach(() => {
    reviewRepo = {
      findById: jest.fn(),
      update: jest.fn(),
      updateAndRecomputeArticleScore: jest.fn(),
    } as any;

    service = new UpdateReviewService(reviewRepo);
  });

  it('updates only the commentary without recomputing the score', async () => {
    const dto = new UpdateReviewDTO('review-1', undefined, 'Updated commentary');
    reviewRepo.findById.mockResolvedValue(reviewRecord);
    reviewRepo.update.mockResolvedValue(
      Review.factory({
        id: 'review-1',
        articleId: 'article-1',
        reviewerId,
        score: 9,
        commentary: 'Updated commentary',
      })
    );

    const result = await service.execute(reviewerId, dto);

    expect(result.id).toBe('review-1');
    expect(result.commentary).toBe('Updated commentary');
    expect(reviewRepo.updateAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('uses the transactional path when score changes', async () => {
    const dto = new UpdateReviewDTO('review-1', 9, undefined);
    reviewRepo.findById.mockResolvedValue(reviewRecord);
    (reviewRepo.updateAndRecomputeArticleScore as jest.Mock).mockResolvedValue(
      Review.factory({
        id: 'review-1',
        articleId: 'article-1',
        reviewerId,
        score: 9,
        commentary: 'Updated',
      })
    );

    await service.execute(reviewerId, dto);

    expect(reviewRepo.updateAndRecomputeArticleScore).toHaveBeenCalledWith(
      dto,
      'article-1',
    );
  });

  it('throws NotFoundException if review does not exist', async () => {
    const dto = new UpdateReviewDTO('nonexistent', 5, undefined);
    reviewRepo.findById.mockResolvedValue(null);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnauthorizedException when a non-owner tries to update', async () => {
    const dto = new UpdateReviewDTO('review-1', 5, undefined);
    reviewRepo.findById.mockResolvedValue(reviewRecord);

    await expect(service.execute('someone-else', dto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(reviewRepo.update).not.toHaveBeenCalled();
    expect(reviewRepo.updateAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
