import { Article, ArticleAuthor } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';
import { UpdateArticleDTO } from '../../application/dtos/article/updateArticle.dto';

export abstract class ArticleRepository {
  abstract create(data: CreateArticleDTO): Promise<Article>;
  abstract findById(id: string): Promise<Article | null>;
  abstract findAll(): Promise<Article[]>;
  abstract findAllAuthors(): Promise<ArticleAuthor[]>;
  abstract findByArticleId(articleId: string): Promise<ArticleAuthor[]>;
  abstract update(data: UpdateArticleDTO): Promise<Article>;
  abstract delete(id: string): Promise<boolean>;
}
