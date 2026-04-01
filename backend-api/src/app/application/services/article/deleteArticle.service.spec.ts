import { DeleteArticleService } from './deleteArticle.service';
import {
  ArticleDatabaseAdapter,
  ReviewDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ConflictException,
} from '../../../shared/exceptions/app.exception';

describe('DeleteArticleService', () => {
  let service: DeleteArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let reviewAdapter: jest.Mocked<ReviewDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  const articleRecord = {
    id: 'article-1',
    summary: 'A paper',
    scoreAvg: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
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

  it('should delete an article with no authors or reviews', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([]);
    reviewAdapter.findMany.mockResolvedValue([]);
    articleAdapter.delete.mockResolvedValue(true);

    const result = await service.execute('article-1');

    expect(result).toBe(true);
    expect(articleAdapter.delete).toHaveBeenCalledWith('article-1');
  });

  it('should throw NotFoundException if article does not exist', async () => {
    articleAdapter.findById.mockResolvedValue(null);

    await expect(service.execute('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if article has authors', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([
      {
        id: 'aa-1',
        articleId: 'article-1',
        userId: 'user-1',
        createdOn: new Date(),
        updatedOn: new Date(),
        deletedOn: null,
      },
    ]);

    await expect(service.execute('article-1')).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw ConflictException if article has reviews', async () => {
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([]);
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

    await expect(service.execute('article-1')).rejects.toThrow(
      ConflictException,
    );
  });
});
