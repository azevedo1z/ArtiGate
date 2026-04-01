import { UpdateReviewService } from './updateReview.service';
import { UpdateReviewDTO } from '../../dtos/review/updateReview.dto';
import {
  ReviewDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('UpdateReviewService', () => {
  let service: UpdateReviewService;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;

  const reviewRecord = {
    id: 'review-1',
    articleId: 'article-1',
    reviewerId: 'reviewer-1',
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
      findMany: jest.fn(),
    } as any;

    articleAdapter = {
      update: jest.fn(),
    } as any;

    service = new UpdateReviewService(reviewAdapter, articleAdapter);
  });

  it('should update a review and return it', async () => {
    const dto = new UpdateReviewDTO('review-1', undefined, undefined, undefined, 'Updated commentary');
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    reviewAdapter.update.mockResolvedValue({ ...reviewRecord, commentary: 'Updated commentary' });

    const result = await service.execute(dto);

    expect(result.id).toBe('review-1');
    expect(result.commentary).toBe('Updated commentary');
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });

  it('should recalculate scoreAvg when score is updated', async () => {
    const dto = new UpdateReviewDTO('review-1', undefined, undefined, 9, undefined);
    reviewAdapter.findById.mockResolvedValue(reviewRecord);
    reviewAdapter.update.mockResolvedValue({ ...reviewRecord, score: 9 });
    reviewAdapter.findMany.mockResolvedValue([
      { ...reviewRecord, score: 9 },
      { ...reviewRecord, id: 'review-2', reviewerId: 'reviewer-2', score: 7 },
    ]);

    await service.execute(dto);

    expect(articleAdapter.update).toHaveBeenCalledWith(
      expect.objectContaining({ scoreAvg: 8 }),
    );
  });

  it('should throw NotFoundException if review does not exist', async () => {
    const dto = new UpdateReviewDTO('nonexistent', undefined, undefined, 5, undefined);
    reviewAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(NotFoundException);
  });
});
