import { Article } from '../../domain/models/article.model';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';
import { PaginationDTO } from '../../shared/dtos/pagination.dto';

export abstract class ArticleRepository {
  abstract create(data: CreateArticleDTO): Promise<Article>;
  abstract update(data: UpdateArticleDTO): Promise<Article>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Article | null>;
  abstract findAll(pagination?: PaginationDTO): Promise<Article[]>;
  abstract countAll(): Promise<number>;
  abstract findByIds(ids: string[]): Promise<Article[]>;
  abstract findReviewableByUser(userId: string): Promise<Article[]>;
}
