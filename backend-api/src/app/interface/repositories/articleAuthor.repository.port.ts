export interface ArticleAuthorRecord {
  id: string;
  articleId: string;
  userId: string;
}

export interface ArticleAuthorWriteData {
  articleId: string;
  userId: string;
}

export abstract class ArticleAuthorRepository {
  abstract create(data: ArticleAuthorWriteData): Promise<ArticleAuthorRecord>;
  abstract update(data: ArticleAuthorWriteData): Promise<ArticleAuthorRecord>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<ArticleAuthorRecord | null>;
  abstract findAll(): Promise<ArticleAuthorRecord[]>;
  abstract findMany(articleId: string): Promise<ArticleAuthorRecord[]>;
  abstract findManyByUserId(userId: string): Promise<ArticleAuthorRecord[]>;
}
