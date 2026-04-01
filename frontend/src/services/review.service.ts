import apiClient from './api.service';
import { Review, CreateReviewData } from '../shared/types/types.shared';

class ReviewService {
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await apiClient.post('/review/create', data);
    return response.data;
  }

  async getByArticleId(articleId: string): Promise<Review[]> {
    const response = await apiClient.get(`/review/article/${articleId}`);
    return response.data;
  }
}

export const reviewService = new ReviewService();
