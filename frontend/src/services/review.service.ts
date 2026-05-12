import apiClient from './api.service';
import {
  CreateReviewData,
  Review,
  ReviewWithArticleSummary,
} from '../shared/types/types.shared';

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await apiClient.post('/review/create', data);
    return response.data;
  }

  async getByArticleId(articleId: string): Promise<Review[]> {
    const response = await apiClient.get(`/review/article/${articleId}`);
    return response.data;
  }

  async getMyReviews(): Promise<Review[]> {
    const response = await apiClient.get('/review/me');
    return response.data;
  }

  async getMyReviewsExpanded(): Promise<ReviewWithArticleSummary[]> {
    const response = await apiClient.get('/review/me/expanded');
    return response.data;
  }
}

export const reviewService = new ReviewService();
