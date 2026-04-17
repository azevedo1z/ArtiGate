import apiClient from './api.service';
import {
  Article,
  CreateArticleData,
  PaginatedResponse,
  PaginationParams,
} from '../shared/types/types.shared';

class ArticleService {
  async createArticle(data: CreateArticleData): Promise<Article> {
    const response = await apiClient.post('/article/create', data);
    return response.data;
  }

  async getAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get('/article/all', { params });
    return response.data;
  }

  async getMyArticles(authorId: string): Promise<Article[]> {
    const response = await apiClient.get(`/article/author/${authorId}`);
    return response.data;
  }
}

export const articleService = new ArticleService();
