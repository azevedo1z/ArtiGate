import { AxiosError } from 'axios';
import apiClient from './api.service';
import {
  Article,
  CreateArticleData,
  CreateArticleResponse,
  PaginatedResponse,
  PaginationParams,
} from '../shared/types/types.shared';

class ArticleService {
  async createArticle(data: CreateArticleData): Promise<CreateArticleResponse> {
    const formData = new FormData();
    formData.append('summary', data.summary);
    data.authorIds.forEach((id) => formData.append('authorIds', id));
    formData.append('pdf', data.pdf, data.pdf.name);

    const response = await apiClient.post('/article/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async getAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get('/article/all', { params });
    return response.data;
  }

  async getMyArticles(): Promise<Article[]> {
    const response = await apiClient.get('/article/me');
    return response.data;
  }

  async getUnreviewedAndNotAuthored(): Promise<Article[]> {
    const response = await apiClient.get('/article/unreviewed-and-not-authored');
    return response.data;
  }

  async downloadAttachment(articleId: string): Promise<void> {
    try {
      const response = await apiClient.get(`/article/${articleId}/attachment`, {
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'] as
        | string
        | undefined;
      const filename = parseFilenameFromDisposition(disposition) ?? 'attachment.pdf';

      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], {
        type:
          typeof contentType === 'string' ? contentType : 'application/pdf',
      });
      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      throw await rehydrateBlobError(error);
    }
  }
}

const parseFilenameFromDisposition = (
  disposition?: string
): string | null => {
  if (!disposition) return null;
  const plainMatch = /filename="?([^";]+)"?/i.exec(disposition);
  return plainMatch?.[1] ?? null;
};

const rehydrateBlobError = async (error: unknown): Promise<unknown> => {
  if (!(error instanceof AxiosError) || !error.response) return error;
  const data = error.response.data;
  if (!(data instanceof Blob)) return error;

  try {
    const text = await data.text();
    error.response.data = text ? JSON.parse(text) : undefined;
  } catch {
    // not JSON; leave as-is
  }
  return error;
};

export const articleService = new ArticleService();
