import { DeleteReviewService } from './deleteReview.service';
import { ReviewDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('DeleteReviewService', () => {
  let service: DeleteReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;

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
    reviewAdapter = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new DeleteReviewService(reviewAdapter);
  });

  it('should delete a review successfully', async () => {
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    reviewAdapter.delete.mockResolvedValue(true);

    const result = await service.execute('review-1');

    expect(result).toBe(true);
    expect(reviewAdapter.delete).toHaveBeenCalledWith('review-1');
  });

  it('should throw NotFoundException if review does not exist', async () => {
    reviewAdapter.findById.mockResolvedValue(null);

    await expect(service.execute('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
