import { Article } from '@prisma/client';
import { CreateArticleDTO } from '../../application/dtos/article/createArticle.dto';

export abstract class ArticleRepository {
  abstract create(data: CreateArticleDTO): Promise<Article>;
  abstract findById(id: string): Promise<Article | null>;
  abstract findAll(): Promise <Array<Article>>;
}
