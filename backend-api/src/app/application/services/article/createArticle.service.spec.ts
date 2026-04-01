import { CreateArticleService } from './createArticle.service';
import { CreateArticleDTO } from '../../dtos/article/createArticle.dto';
import {
  ArticleDatabaseAdapter,
  ArticleAuthorDatabaseAdapter,
} from '../../../interface/adapter/database.adapter';

describe('CreateArticleService', () => {
  let service: CreateArticleService;
  let articleAdapter: jest.Mocked<ArticleDatabaseAdapter>;
  let articleAuthorAdapter: jest.Mocked<ArticleAuthorDatabaseAdapter>;

  beforeEach(() => {
    articleAdapter = {
      create: jest.fn(),
    } as any;

    articleAuthorAdapter = {
      create: jest.fn(),
    } as any;

    service = new CreateArticleService(articleAdapter, articleAuthorAdapter);
  });

  it('should create an article and associate authors', async () => {
    const dto = new CreateArticleDTO('A research paper', ['user-1', 'user-2']);
    articleAdapter.create.mockResolvedValue({
      id: 'article-1',
      summary: 'A research paper',
      scoreAvg: 0,
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });
    articleAuthorAdapter.create.mockResolvedValue({} as any);

    const result = await service.execute(dto);

    expect(result.id).toBe('article-1');
    expect(result.summary).toBe('A research paper');
    expect(result.scoreAvg).toBe(0);
    expect(articleAuthorAdapter.create).toHaveBeenCalledTimes(2);
    expect(articleAuthorAdapter.create).toHaveBeenCalledWith({
      articleId: 'article-1',
      userId: 'user-1',
    });
    expect(articleAuthorAdapter.create).toHaveBeenCalledWith({
      articleId: 'article-1',
      userId: 'user-2',
    });
  });

  it('should create an article with a single author', async () => {
    const dto = new CreateArticleDTO('Solo paper', ['user-1']);
    articleAdapter.create.mockResolvedValue({
      id: 'article-2',
      summary: 'Solo paper',
      scoreAvg: 0,
      createdOn: new Date(),
      updatedOn: new Date(),
      deletedOn: null,
    });
    articleAuthorAdapter.create.mockResolvedValue({} as any);

    const result = await service.execute(dto);

    expect(result.id).toBe('article-2');
    expect(articleAuthorAdapter.create).toHaveBeenCalledTimes(1);
  });
});
