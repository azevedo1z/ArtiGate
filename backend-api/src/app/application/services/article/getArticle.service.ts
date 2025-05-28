import { BadRequestException, Injectable } from '@nestjs/common';
import { Article } from '../../../domain/models/article.model';
import { ArticleDatabaseAdapter } from '../../../interface/adapter/database.adapter';
import { GetArticleAuthorService } from '../articleAuthor/getArticleAuthor.service';

@Injectable()
export class GetArticleService {
  constructor(
    private readonly adapter: ArticleDatabaseAdapter,
    private readonly getArticleAuthorService: GetArticleAuthorService
  ) {}

  async getById(id: string): Promise<Article | null> {
    const existingArticle = await this.adapter.findById(id);

    if (existingArticle == null)
      throw new BadRequestException(`There is no article with the ID "${id}".`);

    return Article.factory(
      existingArticle.id,
      existingArticle.summary,
      existingArticle.scoreAvg
    );
  }

  async getAll(): Promise<Article[]> {
    const articles = await this.adapter.findAll();

    return articles.map((existingArticle) =>
      Article.factory(
        existingArticle.id,
        existingArticle.summary,
        existingArticle.scoreAvg
      )
    );
  }

  async getByAuthorId(authorId: string): Promise<Article[]> {
    const articleAuthors =
      await this.getArticleAuthorService.getArticleByAuthorId(authorId);

    const articles = await Promise.all(
      articleAuthors.map((existingArticleAuthor) =>
        this.adapter.findById(existingArticleAuthor.articleId)
      )
    );

    return articles
      .filter(
        (article): article is NonNullable<typeof article> => article !== null
      )
      .map((article) =>
        Article.factory(article.id, article.summary, article.scoreAvg)
      );
  }
}
