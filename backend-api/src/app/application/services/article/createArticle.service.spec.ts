import { CreateArticleService } from './createArticle.service';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { Article } from '../../../domain/models/article.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { EnsureAuthorsExistService } from './ensureAuthorsExist.service';
import { ValidationException } from '../../../shared/exceptions/app.exception';

describe('CreateArticleService', () => {
  let service: CreateArticleService;
  let articleRepo: jest.Mocked<ArticleRepository>;
  let ensureAuthorsExistService: jest.Mocked<EnsureAuthorsExistService>;

  const articleRecord = Article.factory({
    id: 'article-1',
    summary: 'A research paper',
    scoreAvg: 0,
  });

  beforeEach(() => {
    articleRepo = { create: jest.fn() } as any;
    ensureAuthorsExistService = { execute: jest.fn() } as any;
    service = new CreateArticleService(articleRepo, ensureAuthorsExistService);
  });

  it('creates the article after the author-existence check passes', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'user-2']);
    ensureAuthorsExistService.execute.mockResolvedValue(undefined);
    articleRepo.create.mockResolvedValue(articleRecord);

    const result = await service.execute(dto);

    expect(ensureAuthorsExistService.execute).toHaveBeenCalledWith([
      'user-1',
      'user-2',
    ]);
    expect(articleRepo.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
  });

  it('propagates ValidationException from the author-existence check and skips the create', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'bad-id']);
    ensureAuthorsExistService.execute.mockRejectedValue(
      new ValidationException('missing'),
    );

    await expect(service.execute(dto)).rejects.toThrow(ValidationException);
    expect(articleRepo.create).not.toHaveBeenCalled();
  });
});
