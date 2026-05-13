import { DeleteArticleService } from './deleteArticle.service';
import { Article } from '../../../domain/models/article.model';
import { Review } from '../../../domain/models/review.model';
import { ArticleRepository } from '../../../interface/repositories/article.repository.port';
import { ArticleAuthorRepository } from '../../../interface/repositories/articleAuthor.repository.port';
import { ReviewRepository } from '../../../interface/repositories/review.repository.port';
import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '../../../shared/exceptions/app.exception';

describe('DeleteArticleService', () => {
  let service: DeleteArticleService;
  let articleRepo: jest.Mocked<ArticleRepository>;
  let reviewRepo: jest.Mocked<ReviewRepository>;
  let articleAuthorRepo: jest.Mocked<ArticleAuthorRepository>;

  const requesterId = 'user-1';
  const articleRecord = Article.factory({
    id: 'article-1',
    summary: 'A research paper',
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
    articleRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    reviewRepo = {
      findMany: jest.fn(),
    } as any;

    articleAuthorRepo = {
      findMany: jest.fn(),
    } as any;

    service = new DeleteArticleService(
      articleRepo,
      reviewRepo,
      articleAuthorRepo,
    );
  });

  it('deletes the article when the requester is an author and no reviews exist', async () => {
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([authorRow]);
    reviewRepo.findMany.mockResolvedValue([]);
    articleRepo.delete.mockResolvedValue(true);

    const result = await service.execute(requesterId, 'article-1');

    expect(result).toBe(true);
    expect(articleRepo.delete).toHaveBeenCalledWith('article-1');
  });

  it('throws NotFoundException if article does not exist', async () => {
    articleRepo.findById.mockResolvedValue(null);

    await expect(service.execute(requesterId, 'nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws UnauthorizedException when the requester is not an author', async () => {
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([
      { ...authorRow, userId: 'other-user' },
    ]);

    await expect(service.execute(requesterId, 'article-1')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws ConflictException if article has reviews', async () => {
    articleRepo.findById.mockResolvedValue(articleRecord);
    articleAuthorRepo.findMany.mockResolvedValue([authorRow]);
    reviewRepo.findMany.mockResolvedValue([
      Review.factory({
        id: 'review-1',
        articleId: 'article-1',
        reviewerId: 'reviewer-1',
        score: 8,
        commentary: 'Good',
      }),
    ]);

    await expect(service.execute(requesterId, 'article-1')).rejects.toThrow(
      ConflictException,
    );
  });
});
