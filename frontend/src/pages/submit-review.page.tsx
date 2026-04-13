import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Eye, ArrowLeft, Send, FileText } from 'lucide-react';
import Button from '../components/button.component';
import Textarea from '../components/textarea.component';
import Select from '../components/select.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { RootState } from '../store/my.store';
import { articleService } from '../services/article.service';
import { reviewService } from '../services/review.service';
import { Article } from '../shared/types/types.shared';

const SubmitReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);
  const rolesData = useSelector((state: RootState) => state.roles.data);

  const [articles, setArticles] = useState<Article[]>([]);
  const [articleId, setArticleId] = useState('');
  const [score, setScore] = useState<number>(5);
  const [commentary, setCommentary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const isReviewer =
    rolesData?.some((role) => role._name?.includes('REVIEWER')) ?? false;

  useEffect(() => {
    if (!isReviewer) {
      toast.error('Only reviewers can access this page.');
      navigate('/home');
      return;
    }

    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll();
        setArticles(data);
      } catch {
        toast.error('Failed to load articles.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchArticles();
  }, [isReviewer, navigate]);

  const articleOptions = articles.map((a) => ({
    label: a._summary.length > 70 ? `${a._summary.slice(0, 70)}…` : a._summary,
    value: a._id,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?._id) {
      toast.error('User session not found. Please log in again.');
      return;
    }

    if (!articleId) {
      toast.error('Please select an article to review.');
      return;
    }

    setIsLoading(true);
    try {
      await reviewService.createReview({
        articleId,
        reviewerId: userData._id,
        score,
        commentary,
      });
      toast.success('Review submitted successfully!');
      navigate('/home');
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Wrapper centered={false}>
        <Container size="sm" className="flex justify-center items-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-purple-600 border-t-transparent" />
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper centered={false}>
      <Container size="sm" noDefaultPadding className="space-y-8 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Submit Review
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Evaluate a submitted article and provide your feedback.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <form onSubmit={handleSubmit}>
            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Article
                </h2>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="articleSelect"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Select article <span className="text-red-500">*</span>
                </label>
                <Select
                  id="articleSelect"
                  placeholder="Choose an article to review..."
                  options={articleOptions}
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value)}
                  required
                />
              </div>
            </section>

            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Evaluation
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Score <span className="text-red-500">*</span>
                  </label>
                  <span className="text-2xl font-bold text-purple-600">
                    {score}
                    <span className="text-sm font-normal text-gray-400">
                      /10
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 — Poor</span>
                  <span>10 — Excellent</span>
                </div>
              </div>

              <Textarea
                id="commentary"
                label="Commentary *"
                placeholder="Provide detailed feedback for the authors..."
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                rows={5}
                required
              />
            </section>

            <section className="p-6 flex gap-3">
              <Button
                type="submit"
                variantClassName="primary"
                fullWidth
                isLoading={isLoading}
                loadingText="Submitting..."
                leadingIcon={<Send className="h-4 w-4" />}
              >
                Submit Review
              </Button>
              <Button
                type="button"
                variantClassName="secondary"
                fullWidth
                onClick={() => navigate('/home')}
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Cancel
              </Button>
            </section>
          </form>
        </div>
      </Container>
    </Wrapper>
  );
};

export default SubmitReviewPage;
