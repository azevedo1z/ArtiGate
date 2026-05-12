import { DeleteArticleService } from './deleteArticle.service';
import {
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DeleteArticleService', () => {
  let service: DeleteArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  const requesterId = 'user-1';
  const articleRecord = {
    id: 'article-1',
    summary: 'A paper',
    scoreAvg: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  const authorRow = {
    id: 'aa-1',
    articleId: 'article-1',
    userId: requesterId,
    createdOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleAdapter = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    reviewAdapter = {
      findMany: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      findMany: jest.fn(),
    } as any;

    service = new DeleteArticleService(
      articleAdapter,
      reviewAdapter,
      articleAuthorAdapter,
    );
  });

  it('deletes the article when the requester is an author and no reviews exist', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([authorRow]);
    reviewAdapter.findMany.mockResolvedValue([]);
    articleAdapter.delete.mockResolvedValue(true);

    const result = await service.execute(requesterId, 'article-1');

    expect(result).toBe(true);
    expect(articleAdapter.delete).toHaveBeenCalledWith('article-1');
  });

  it('throws NotFoundException if article does not exist', async () => {
    articleAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(requesterId, 'nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnauthorizedException when the requester is not an author', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { ...authorRow, userId: 'other-user' },
    ]);

    await expect(service.execute(requesterId, 'article-1')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws ConflictException if article has reviews', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([authorRow]);
    reviewAdapter.findMany.mockResolvedValue([
      {
        id: 'review-1',
        articleId: 'article-1',
        reviewerId: 'reviewer-1',
        score: 8,
        commentary: 'Good',
        createdOn: new Date(),
        updatedOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute(requesterId, 'article-1')).rejects.toThrow(
      ConflictException,
    );
  });
});
