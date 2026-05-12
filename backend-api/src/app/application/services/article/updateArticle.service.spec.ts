import { UpdateArticleService } from './updateArticle.service';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleAuthorDatabaseAdapter,
  ArticleDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';
import {
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '../../../shared/exceptions/app.exception';

describe('UpdateArticleService', () => {
  let service: UpdateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;
  let ensureAuthorsExistService: jest.Mocked<EnsureAuthorsExistService>;

  const requesterId = 'user-1';
  const articleRecord = {
    id: 'article-1',
    summary: 'Updated paper',
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
    articleAdapter = { findById: jest.fn(), update: jest.fn() } as any;
    articleAuthorAdapter = { findMany: jest.fn() } as any;
    ensureAuthorsExistService = { execute: jest.fn() } as any;
    service = new UpdateArticleService(
      articleAdapter,
      articleAuthorAdapter,
      ensureAuthorsExistService,
    );
  });

  it('updates the article and returns the domain model', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([authorRow]);
    articleAdapter.update.mockResolvedValue(articleRecord);

    const result = await service.execute(requesterId, dto);

    expect(articleAdapter.update).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('Updated paper');
  });

  it('runs the author-existence check before updating', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['user-2', 'user-3']);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([authorRow]);
    ensureAuthorsExistService.execute.mockResolvedValue(undefined);
    articleAdapter.update.mockResolvedValue(articleRecord);

    await service.execute(requesterId, dto);

    expect(ensureAuthorsExistService.execute).toHaveBeenCalledWith([
      'user-2',
      'user-3',
    ]);
    expect(articleAdapter.update).toHaveBeenCalledWith(dto);
  });

  it('propagates ValidationException from the author check and skips the update', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['bad-id']);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([authorRow]);
    ensureAuthorsExistService.execute.mockRejectedValue(
      new ValidationException('missing'),
    );

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      ValidationException,
    );
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundException if the article does not exist', async () => {
    const dto = new UpdateArticleDTO('nonexistent', 'Updated', undefined);
    articleAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when the requester is not an author', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAuthorAdapter.findMany.mockResolvedValue([
      { ...authorRow, userId: 'other-user' },
    ]);

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });
});
