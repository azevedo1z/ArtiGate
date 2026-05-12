import { UpdateReviewService } from './updateReview.service';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('UpdateReviewService', () => {
  let service: UpdateReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;

  const reviewerId = 'reviewer-1';
  const reviewRecord = {
    id: 'review-1',
    articleId: 'article-1',
    reviewerId,
    score: 9,
    commentary: 'Updated',
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    reviewAdapter = {
      findById: jest.fn(),
      update: jest.fn(),
      updateAndRecomputeArticleScore: jest.fn(),
    } as any;

    service = new UpdateReviewService(reviewAdapter);
  });

  it('updates only the commentary without recomputing the score', async () => {
    const dto = new UpdateReviewDTO('review-1', undefined, 'Updated commentary');
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    reviewAdapter.update.mockResolvedValue({
      ...reviewRecord,
      commentary: 'Updated commentary',
    });

    const result = await service.execute(reviewerId, dto);

    expect(result.id).toBe('review-1');
    expect(result.commentary).toBe('Updated commentary');
    expect(reviewAdapter.updateAndRecomputeArticleScore).not.toHaveBeenCalled();
  });

  it('uses the transactional path when score changes', async () => {
    const dto = new UpdateReviewDTO('review-1', 9, undefined);
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    (reviewAdapter.updateAndRecomputeArticleScore as jest.Mock).mockResolvedValue({
      ...reviewRecord,
      score: 9,
    });

    await service.execute(reviewerId, dto);

    expect(reviewAdapter.updateAndRecomputeArticleScore).toHaveBeenCalledWith(
      dto,
      'article-1',
    );
  });

  it('throws NotFoundException if review does not exist', async () => {
    const dto = new UpdateReviewDTO('nonexistent', 5, undefined);
    reviewAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(reviewerId, dto)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnauthorizedException when a non-owner tries to update', async () => {
    const dto = new UpdateReviewDTO('review-1', 5, undefined);
    reviewAdapter.findById.mockResolvedValue(reviewRecord);

    await expect(service.execute('someone-else', dto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(reviewAdapter.update).not.toHaveBeenCalled();
    expect(reviewAdapter.updateAndRecomputeArticleScore).not.toHaveBeenCalled();
  });
});
