import { GetArticleService } from './getArticle.service';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('GetArticleService', () => {
  let service: GetArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  const articleRecord = {
    id: 'article-1',
    summary: 'A paper',
    scoreAvg: 7.5,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleAdapter = {
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      findManyByUserId: jest.fn(),
    } as any;

    service = new GetArticleService(articleAdapter, articleAuthorAdapter);
  });

  describe('getById', () => {
    it('should return an article by id', async () => {
      articleAdapter.findById.mockResolvedValue(articleRecord);

      const result = await service.getById('article-1');

      expect(result.id).toBe('article-1');
      expect(result.summary).toBe('A paper');
      expect(result.scoreAvg).toBe(7.5);
    });

    it('should throw NotFoundException if article not found', async () => {
      articleAdapter.findById.mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
    it('should return all articles', async () => {
      articleAdapter.findAll.mockResolvedValue([articleRecord]);

      const result = await service.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('article-1');
    });

    it('should return empty array when no articles exist', async () => {
      articleAdapter.findAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getByAuthorId', () => {
    it('should return articles for an author', async () => {
      articleAuthorAdapter.findManyByUserId.mockResolvedValue([
        {
          id: 'aa-1',
          articleId: 'article-1',
          userId: 'user-1',
          createdOn: new Date(),
          updatedOn: new Date(),
          deletedOn: null,
        },
      ]);
      articleAdapter.findById.mockResolvedValue(articleRecord);

      const result = await service.getByAuthorId('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('article-1');
    });

    it('should return empty array when author has no articles', async () => {
      articleAuthorAdapter.findManyByUserId.mockResolvedValue([]);

      const result = await service.getByAuthorId('user-1');

      expect(result).toEqual([]);
    });

    it('should filter out null articles from results', async () => {
      articleAuthorAdapter.findManyByUserId.mockResolvedValue([
        {
          id: 'aa-1',
          articleId: 'article-1',
          userId: 'user-1',
          createdOn: new Date(),
          updatedOn: new Date(),
          deletedOn: null,
        },
        {
          id: 'aa-2',
          articleId: 'article-deleted',
          userId: 'user-1',
          createdOn: new Date(),
          updatedOn: new Date(),
          deletedOn: null,
        },
      ]);
      articleAdapter.findById
        .mockResolvedValueOnce(articleRecord)
        .mockResolvedValueOnce(null);

      const result = await service.getByAuthorId('user-1');

      expect(result).toHaveLength(1);
    });
  });
});
