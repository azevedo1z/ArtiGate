import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
} from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import { RootState } from '../store/my.store';
import { articleService } from '../services/article.service';
import { reviewService } from '../services/review.service';
import { Article, Review } from '../shared/types/types.shared';

const MyArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
  const [loadingReviews, setLoadingReviews] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!userData?._id) return;

      try {
        const data = await articleService.getMyArticles(userData._id);
        setArticles(data);
      } catch {
        toast.error('Failed to load your articles.');
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
    } catch {
      toast.error('Failed to load reviews for this article.');
    } finally {
      setLoadingReviews(null);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 8) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 5) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-8 py-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              My Articles
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {isLoading
                ? 'Loading...'
                : `${articles.length} article${
                    articles.length !== 1 ? 's' : ''
                  } submitted`}
            </p>
          </div>
          <Button
            variantClassName="primary"
            onClick={() => navigate('/submit-article')}
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            Submit New
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">No articles yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Submit your first article to get started.
              </p>
            </div>
            <Button
              variantClassName="primary"
              onClick={() => navigate('/submit-article')}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Submit your first article
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {articles.map((article) => {
              const isExpanded = expandedId === article._id;
              const reviews = reviewsMap[article._id];
              const isLoadingThis = loadingReviews === article._id;

              return (
                <div
                  key={article._id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 flex-1">
                          {article._summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {article._scoreAvg > 0 ? (
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-semibold text-amber-700">
                              {article._scoreAvg.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-400">
                              Pending
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => toggleReviews(article._id)}
                          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-md hover:bg-blue-50"
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
                      <p className="text-xs text-gray-400 font-mono truncate">
                        {article._id}
                      </p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 rounded-b-xl">
                      {isLoadingThis ? (
                        <div className="flex justify-center py-4">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        </div>
                      ) : !reviews || reviews.length === 0 ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>No reviews yet</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {reviews.length} Review
                            {reviews.length !== 1 ? 's' : ''}
                          </p>
                          {reviews.map((review) => (
                            <div
                              key={review._id}
                              className="bg-white rounded-lg border border-gray-200 p-4 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-mono truncate max-w-xs">
                                  Reviewer: {review._reviewerId}
                                </span>
                                <div
                                  className={`flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor(
                                    review._score
                                  )}`}
                                >
                                  <Star className="h-3 w-3 fill-current" />
                                  {review._score}/10
                                </div>
                              </div>
                              {review._commentary && (
                                <p className="text-sm text-gray-700 leading-relaxed">
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
            variantClassName="secondary"
            onClick={() => navigate('/home')}
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
