export interface ReviewWithArticleSummary {
  id: string;
  articleId: string;
  reviewerId: string;
  score: number;
  commentary: string;
  article: { id: string; summary: string } | null;
}
