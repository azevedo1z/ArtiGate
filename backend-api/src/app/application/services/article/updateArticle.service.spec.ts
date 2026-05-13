import { UpdateArticleService } from './updateArticle.service';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';
import {
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '../../../shared/exceptions/app.exception';

describe('UpdateArticleService', () => {
  let service: UpdateArticleService;
  let articleRepo: jest.Mocked<ArticleRepository>;
  let articleAuthorRepo: jest.Mocked<ArticleAuthorRepository>;
  let ensureAuthorsExistService: jest.Mocked<EnsureAuthorsExistService>;

  const requesterId = 'user-1';
  const articleRecord = Article.factory({
    id: 'article-1',
    summary: 'Updated paper',
    scoreAvg: 0,
  });

  const authorRow = {
    id: 'aa-1',
    articleId: 'article-1',
    userId: requesterId,
    createdOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleRepo = { findById: jest.fn(), update: jest.fn() } as any;
    articleAuthorRepo = { findMany: jest.fn() } as any;
    ensureAuthorsExistService = { execute: jest.fn() } as any;
    service = new UpdateArticleService(
      articleRepo,
      articleAuthorRepo,
      ensureAuthorsExistService,
    );
  });

  it('updates the article and returns the domain model', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([authorRow]);
    articleRepo.update.mockResolvedValue(articleRecord);

    const result = await service.execute(requesterId, dto);

    expect(articleRepo.update).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('Updated paper');
  });

  it('runs the author-existence check before updating', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['user-2', 'user-3']);
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([authorRow]);
    ensureAuthorsExistService.execute.mockResolvedValue(undefined);
    articleRepo.update.mockResolvedValue(articleRecord);

    await service.execute(requesterId, dto);

    expect(ensureAuthorsExistService.execute).toHaveBeenCalledWith([
      'user-2',
      'user-3',
    ]);
    expect(articleRepo.update).toHaveBeenCalledWith(dto);
  });

  it('propagates ValidationException from the author check and skips the update', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['bad-id']);
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([authorRow]);
    ensureAuthorsExistService.execute.mockRejectedValue(
      new ValidationException('missing'),
    );

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      ValidationException,
    );
    expect(articleRepo.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundException if the article does not exist', async () => {
    const dto = new UpdateArticleDTO('nonexistent', 'Updated', undefined);
    articleRepo.findById.mockResolvedValue(null);

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(articleRepo.update).not.toHaveBeenCalled();
  });

  it('throws UnauthorizedException when the requester is not an author', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([
      { ...authorRow, userId: 'other-user' },
    ]);

    await expect(service.execute(requesterId, dto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(articleRepo.update).not.toHaveBeenCalled();
  });
});
