import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Plus,
  Star,
  ArrowLeft,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  Download,
} from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import { articleService } from '../services/article.service';
import { reviewService } from '../services/review.service';
import { Article, Review } from '../shared/types/types.shared';
import { useUser } from '../hooks/useUser';
import { ROUTES } from '../config/routes.config';
import { scoreColor } from '../utils/score.util';
import { extractErrorMessage } from '../utils/error.util';

const MyArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
  const [loadingReviews, setLoadingReviews] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (articleId: string) => {
    setDownloadingId(articleId);
    try {
      await articleService.downloadAttachment(articleId);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to download attachment.'));
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userData?._id) return;

      try {
        const data = await articleService.getMyArticles();
        setArticles(data);
      } catch (error) {
        toast.error(
          extractErrorMessage(error, 'Failed to load your articles.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [userData]);

  const toggleReviews = async (articleId: string) => {
    if (expandedId === articleId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(articleId);

    if (reviewsMap[articleId]) return;

    setLoadingReviews(articleId);
    try {
      const data = await reviewService.getByArticleId(articleId);
      setReviewsMap((prev) => ({ ...prev, [articleId]: data }));
    } catch (error) {
      toast.error(
        extractErrorMessage(error, 'Failed to load reviews for this article.')
      );
    } finally {
      setLoadingReviews(null);
    }
  };

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-8 py-10">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
              Library
            </p>
            <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
              My Articles
            </h1>
            <p className="text-ink-500 text-sm">
              {isLoading
                ? 'Loading...'
                : `${articles.length} article${
                    articles.length !== 1 ? 's' : ''
                  } submitted`}
            </p>
          </div>
          <Button
            variantClassName="primary"
            onClick={() => navigate(ROUTES.SUBMIT_ARTICLE)}
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            Submit New
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center border border-dashed border-ink-200 rounded-lg">
            <div className="h-12 w-12 bg-ink-50 rounded-md flex items-center justify-center">
              <FileText className="h-6 w-6 text-ink-400" />
            </div>
            <div>
              <p className="text-ink-800 font-medium">No articles yet</p>
              <p className="text-ink-400 text-sm mt-1">
                Submit your first article to get started.
              </p>
            </div>
            <Button
              variantClassName="primary"
              onClick={() => navigate(ROUTES.SUBMIT_ARTICLE)}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Submit your first article
            </Button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink-100 border border-ink-100 rounded-lg bg-snow">
            {articles.map((article) => {
              const isExpanded = expandedId === article._id;
              const reviews = reviewsMap[article._id];
              const isLoadingThis = loadingReviews === article._id;

              return (
                <div key={article._id}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 bg-primary-50 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="h-4 w-4 text-primary-500" />
                        </div>
                        <p className="text-ink-700 text-sm leading-relaxed line-clamp-2 flex-1">
                          {article._summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {article._scoreAvg > 0 ? (
                          <div className="inline-flex items-center gap-1 bg-accent-50 border border-accent-200 rounded-full px-2.5 py-0.5">
                            <Star className="h-3.5 w-3.5 text-accent-600 fill-accent-400" />
                            <span className="text-xs font-semibold text-accent-700">
                              {article._scoreAvg.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-ink-50 border border-ink-100 rounded-full px-2.5 py-0.5">
                            <Clock className="h-3.5 w-3.5 text-ink-400" />
                            <span className="text-xs font-medium text-ink-500">
                              Pending
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handleDownload(article._id)}
                          disabled={downloadingId === article._id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors px-2 py-1 rounded-md hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadingId === article._id ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          PDF
                        </button>

                        <button
                          onClick={() => toggleReviews(article._id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors px-2 py-1 rounded-md hover:bg-primary-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Reviews
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 pl-11">
                      <p className="text-[11px] text-ink-300 font-mono truncate">
                        {article._id}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-ink-100 px-5 py-4 bg-ink-50/50">
                      {isLoadingThis ? (
                        <div className="flex justify-center py-4">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                        </div>
                      ) : !reviews || reviews.length === 0 ? (
                        <div className="flex items-center gap-2 text-ink-400 text-sm py-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>No reviews yet</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
                            {reviews.length} Review
                            {reviews.length !== 1 ? 's' : ''}
                          </p>
                          {reviews.map((review) => (
                            <div
                              key={review._id}
                              className="bg-snow rounded-md border border-ink-100 p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-ink-400 font-mono truncate max-w-xs">
                                  Reviewer: {review._reviewerId}
                                </span>
                                <div
                                  className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor(
                                    review._score
                                  )}`}
                                >
                                  <Star className="h-3 w-3 fill-current" />
                                  {review._score}/10
                                </div>
                              </div>
                              {review._commentary && (
                                <p className="text-sm text-ink-700 leading-relaxed">
                                  {review._commentary}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2">
          <Button
            variantClassName="ghost"
            onClick={() => navigate(ROUTES.HOME)}
            leadingIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </Wrapper>
  );
};

export default MyArticlesPage;
