import { Article as ArticleRow } from '@prisma/client';
import { Article } from '../../domain/models/article.model';

export const articleRowToDomain = (row: ArticleRow): Article =>
  Article.factory({
    id: row.id,
    summary: row.summary,
    scoreAvg: row.scoreAvg,
  });
