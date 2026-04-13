import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Eye, ArrowLeft, Plus, Star, FileText } from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import { RootState } from '../store/my.store';
import { reviewService } from '../services/review.service';
import { Review } from '../shared/types/types.shared';

const MyReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);
  const rolesData = useSelector((state: RootState) => state.roles.data);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isReviewer =
    rolesData?.some((role) => role._name?.includes('REVIEWER')) ?? false;

  useEffect(() => {
    if (!isReviewer) {
      toast.error('Only reviewers can access this page.');
      navigate('/home');
      return;
    }

    const fetchReviews = async () => {
      if (!userData?._id) return;

      try {
        const data = await reviewService.getMyReviews(userData._id);
        setReviews(data);
      } catch {
        toast.error('Failed to load your reviews.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [isReviewer, navigate, userData]);

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
              My Reviews
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {isLoading
                ? 'Loading...'
                : `${reviews.length} review${
                    reviews.length !== 1 ? 's' : ''
                  } submitted`}
            </p>
          </div>
          <Button
            variantClassName="primary"
            onClick={() => navigate('/submit-review')}
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            New Review
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-purple-600 border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Submit your first review to get started.
              </p>
            </div>
            <Button
              variantClassName="primary"
              onClick={() => navigate('/submit-review')}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Submit your first review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div
                      className={`flex items-center gap-1 border rounded-full px-2.5 py-0.5 ${scoreColor(
                        review._score
                      )}`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-semibold">
                        {review._score}/10
                      </span>
                    </div>
                  </div>

                  {review._commentary && (
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {review._commentary}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-mono truncate">
                      {review._articleId}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-mono truncate">
                    {review._id}
                  </p>
                </div>
              </div>
            ))}
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

export default MyReviewsPage;
