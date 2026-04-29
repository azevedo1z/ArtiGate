import { UpdateArticleService } from './updateArticle.service';
import { UpdateArticleDTO } from '../../dtos/article/updateArticle.dto';
import {
  ArticleDatabaseAdapter,
  UserDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';
import {
  NotFoundException,
  ValidationException,
} from '../../../shared/exceptions/app.exception';

describe('UpdateArticleService', () => {
  let service: UpdateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let userAdapter: jest.Mocked<UserDatabaseAdapter>;

  const articleRecord = {
    id: 'article-1',
    summary: 'Updated paper',
    scoreAvg: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
    deletedOn: null,
  };

  beforeEach(() => {
    articleAdapter = { findById: jest.fn(), update: jest.fn() } as any;
    userAdapter = { findById: jest.fn() } as any;
    service = new UpdateArticleService(articleAdapter, userAdapter);
  });

  it('updates the article and returns the domain model', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', undefined);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    articleAdapter.update.mockResolvedValue(articleRecord);

    const result = await service.execute(dto);

    expect(articleAdapter.update).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('Updated paper');
  });

  it('validates authors and updates when all exist', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['user-2', 'user-3']);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    userAdapter.findById.mockResolvedValue({ id: 'user-2' } as any);
    articleAdapter.update.mockResolvedValue(articleRecord);

    await service.execute(dto);

    expect(userAdapter.findById).toHaveBeenCalledWith('user-2');
    expect(userAdapter.findById).toHaveBeenCalledWith('user-3');
    expect(articleAdapter.update).toHaveBeenCalledWith(dto);
  });

  it('throws ValidationException and does not update when an author does not exist', async () => {
    const dto = new UpdateArticleDTO('article-1', 'Updated paper', ['bad-id']);
    articleAdapter.findById.mockResolvedValue(articleRecord);
    userAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(ValidationException);
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundException if the article does not exist', async () => {
    const dto = new UpdateArticleDTO('nonexistent', 'Updated', undefined);
    articleAdapter.findById.mockResolvedValue(null);

    await expect(service.execute(dto)).rejects.toThrow(NotFoundException);
    expect(articleAdapter.update).not.toHaveBeenCalled();
  });
});
