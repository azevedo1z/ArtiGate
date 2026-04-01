import { UpdateArticleService } from './updateArticle.service';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { NotFoundException } from '../../../shared/exceptions/app.exception';

describe('UpdateArticleService', () => {
  let service: UpdateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  const articleRecord = {
    id: 'article-1',
    summary: 'Updated paper',
    scoreAvg: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleAdapter = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      findMany: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    } as any;

    service = new UpdateArticleService(articleAdapter, articleAuthorAdapter);
  });

  it('should update an article without changing authors', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAdapter.update.mockResolvedValue(articleRecord);

    const result = await service.execute(dto);

    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('Updated paper');
    expect(articleAuthorAdapter.findMany).not.toHaveBeenCalled();
  });

  it('should update authors when authorIds are provided', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', [
      'user-2',
      'user-3',
    ]);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAdapter.update.mockResolvedValue(articleRecord);
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
    articleAuthorAdapter.delete.mockResolvedValue(true);
    articleAuthorAdapter.create.mockResolvedValue({} as any);

    await service.execute(dto);

    expect(articleAuthorAdapter.delete).toHaveBeenCalledWith('aa-1');
    expect(articleAuthorAdapter.create).toHaveBeenCalledTimes(2);
    expect(articleAuthorAdapter.create).toHaveBeenCalledWith({
      articleId: 'article-1',
      userId: 'user-2',
    });
    expect(articleAuthorAdapter.create).toHaveBeenCalledWith({
      articleId: 'article-1',
      userId: 'user-3',
    });
  });

  it('should throw NotFoundException if article does not exist', async () => {
    const dto = new UpdateArticleDTO('nonexistent', 'Updated', undefined);
    articleAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(NotFoundException);
  });
});
