import { CreateArticleService } from './createArticle.service';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';

describe('CreateArticleService', () => {
  let service: CreateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;

  beforeEach(() => {
    articleAdapter = {
      create: jest.fn(),
    } as any;

    service = new CreateArticleService(articleAdapter);
  });

  it('persists the article through the adapter and returns the domain model', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'user-2']);
    articleAdapter.create.mockResolvedValue({
      id: 'article-1',
      summary: 'A research paper',
      scoreAvg: 0,
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });

    const result = await service.execute(dto);

    expect(articleAdapter.create).toHaveBeenCalledWith(dto);
    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('A research paper');
    expect(result.scoreAvg).toBe(0);
  });

  it('propagates the adapter error when persistence fails', async () => {
    const dto = new CreateArticleDTO('Solo paper', ['missing-user']);
    articleAdapter.create.mockRejectedValue(new Error('FK violation'));

    await expect(service.execute(dto)).rejects.toThrow('FK violation');
  });
});
