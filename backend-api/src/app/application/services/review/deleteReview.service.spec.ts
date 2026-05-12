import { DeleteReviewService } from './deleteReview.service';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DeleteReviewService', () => {
  let service: DeleteReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;

  const reviewerId = 'reviewer-1';
  const reviewRecord = {
    id: 'review-1',
    articleId: 'article-1',
    reviewerId,
    score: 8,
    commentary: 'Good',
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    reviewAdapter = {
      findById: jest.fn(),
      deleteAndRecomputeArticleScore: jest.fn(),
    } as any;

    service = new DeleteReviewService(reviewAdapter);
  });

  it('delegates the soft-delete + score recompute to the review adapter', async () => {
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    (reviewAdapter.deleteAndRecomputeArticleScore as jest.Mock).mockResolvedValue(
      true,
    );

    const result = await service.execute(reviewerId, 'review-1');

    expect(result).toBe(true);
    expect(reviewAdapter.deleteAndRecomputeArticleScore).toHaveBeenCalledWith(
      'review-1',
      'article-1',
    );
  });

  it('throws NotFoundException if review does not exist', async () => {
    reviewAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(reviewerId, 'nonexistent')).rejects.toThrow(
      NotFoundException,
    );
    expect(reviewAdapter.deleteAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when a non-owner tries to delete', async () => {
    reviewAdapter.findById.mockResolvedValue(reviewRecord);

    await expect(service.execute('someone-else', 'review-1')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(reviewAdapter.deleteAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
