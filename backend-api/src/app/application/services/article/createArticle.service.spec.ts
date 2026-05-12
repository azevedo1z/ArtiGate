import { CreateArticleService } from './createArticle.service';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import {
  ArticleDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import { ValidationException } from '../../../shared/exceptions/app.exception';

describe('CreateArticleService', () => {
  let service: CreateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let userAdapter: jest.Mocked<UserDatabaseAdapter>;

  const articleRecord = {
    id: 'article-1',
    summary: 'A research paper',
    scoreAvg: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleAdapter = { create: jest.fn() } as any;
    userAdapter = { findByIds: jest.fn() } as any;
    service = new CreateArticleService(articleAdapter, userAdapter);
  });

  it('creates the article when all authors exist (batched findByIds)', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'user-2']);
    (userAdapter.findByIds as jest.Mock).mockResolvedValue([
      { id: 'user-1' },
      { id: 'user-2' },
    ] as any);
    articleAdapter.create.mockResolvedValue(articleRecord);

    const result = await service.execute(dto);

    expect(userAdapter.findByIds).toHaveBeenCalledWith(['user-1', 'user-2']);
    expect(articleAdapter.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
  });

  it('throws ValidationException and does not create when an author does not exist', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'bad-id']);
    (userAdapter.findByIds as jest.Mock).mockResolvedValue([
      { id: 'user-1' },
    ] as any);

    await expect(service.execute(dto)).rejects.toThrow(ValidationException);
    expect(articleAdapter.create).not.toHaveBeenCalled();
  });
});
