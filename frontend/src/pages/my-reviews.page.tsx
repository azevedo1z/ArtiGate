import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, ArrowLeft, Plus, Star, FileText } from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import { reviewService } from '../services/review.service';
import { ReviewWithArticleSummary } from '../shared/types/types.shared';
import { useUser } from '../hooks/useUser';
import { ROUTES } from '../config/routes.config';
import { scoreColor } from '../utils/score.util';
import { extractErrorMessage } from '../utils/error.util';

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();

  const [reviews, setReviews] = useState<ReviewWithArticleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userData?._id) return;

      try {
        const data = await reviewService.getMyReviewsExpanded();
        setReviews(data);
      } catch (error) {
        toast.error(
          extractErrorMessage(error, 'Failed to load your reviews.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [userData]);

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-8 py-10">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
              Activity
            </p>
            <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
              My Reviews
            </h1>
            <p className="text-ink-500 text-sm">
              {isLoading
                ? 'Loading...'
                : `${reviews.length} review${
                    reviews.length !== 1 ? 's' : ''
                  } submitted`}
            </p>
          </div>
          <Button
            variantClassName="primary"
            onClick={() => navigate(ROUTES.SUBMIT_REVIEW)}
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            New Review
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center border border-dashed border-ink-200 rounded-lg">
            <div className="h-12 w-12 bg-ink-50 rounded-md flex items-center justify-center">
              <Eye className="h-6 w-6 text-ink-400" />
            </div>
            <div>
              <p className="text-ink-800 font-medium">No reviews yet</p>
              <p className="text-ink-400 text-sm mt-1">
                Submit your first review to get started.
              </p>
            </div>
            <Button
              variantClassName="primary"
              onClick={() => navigate(ROUTES.SUBMIT_REVIEW)}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Submit your first review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-snow rounded-lg border border-ink-100 hover:border-primary-200 transition-colors duration-150 flex flex-col"
              >
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 bg-accent-50 rounded-md flex items-center justify-center">
                      <Eye className="h-4 w-4 text-accent-600" />
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-0.5 ${scoreColor(
                        review.score
                      )}`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-semibold">
                        {review.score}/10
                      </span>
                    </div>
                  </div>

                  {review.article?.summary && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
                        Article
                      </p>
                      <p className="text-ink-700 text-sm leading-relaxed line-clamp-3">
                        {review.article.summary}
                      </p>
                    </div>
                  )}

                  {review.commentary && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
                        Your commentary
                      </p>
                      <p className="text-ink-700 text-sm leading-relaxed line-clamp-3">
                        {review.commentary}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[11px] text-ink-400">
                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-mono truncate">
                      {review.articleId}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-2.5 border-t border-ink-100">
                  <p className="text-[11px] text-ink-300 font-mono truncate">
                    {review.id}
                  </p>
                </div>
              </div>
            ))}
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

export default MyReviewsPage;
