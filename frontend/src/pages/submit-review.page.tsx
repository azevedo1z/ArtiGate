import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, ArrowLeft, Send, FileText, Download } from 'lucide-react';
import Button from '../components/button.component';
import Textarea from '../components/textarea.component';
import Select from '../components/select.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { articleService } from '../services/article.service';
import { reviewService } from '../services/review.service';
import { Article } from '../shared/types/types.shared';
import { useUser } from '../hooks/useUser';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';

const SubmitReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();

  const [articles, setArticles] = useState<Article[]>([]);
  const [articleId, setArticleId] = useState('');
  const [score, setScore] = useState<number>(5);
  const [commentary, setCommentary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!articleId) {
      toast.error('Please select an article first.');
      return;
    }

    setIsDownloading(true);

    try {
      await articleService.downloadAttachment(articleId);
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Failed to download attachment.'));
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getReviewable();
        setArticles(data);
      } catch (error) {
        toast.error(extractErrorMessage(error, 'Failed to load articles.'));
      } finally {
        setIsFetching(false);
      }
    };

    fetchArticles();
  }, []);

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
        score,
        commentary,
      });
      toast.success('Review submitted successfully.');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(
        extractErrorMessage(error, 'Failed to submit review. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Wrapper centered={false}>
        <Container size="sm" className="flex justify-center items-center py-24">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper centered={false}>
      <Container size="sm" noDefaultPadding className="space-y-8 px-4 py-10">
        <div className="space-y-1">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Peer review
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Submit Review
          </h1>
          <p className="text-ink-500 text-sm">
            Evaluate a submitted article and provide your feedback.
          </p>
        </div>

        <div className="bg-snow rounded-lg border border-ink-100 divide-y divide-ink-100">
          <form onSubmit={handleSubmit}>
            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Article
                </h2>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="articleSelect"
                  className="text-xs font-medium text-ink-600 uppercase tracking-wide block"
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

              {articleId && (
                <Button
                  type="button"
                  variantClassName="secondary"
                  onClick={handleDownload}
                  isLoading={isDownloading}
                  loadingText="Downloading..."
                  leadingIcon={<Download className="h-4 w-4" />}
                >
                  Download article PDF
                </Button>
              )}
            </section>

            <section className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Evaluation
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-ink-600 uppercase tracking-wide">
                    Score <span className="text-red-500">*</span>
                  </label>
                  <span className="text-2xl font-semibold text-primary-600 tabular-nums">
                    {score}
                    <span className="text-sm font-normal text-ink-400">
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
                  className="w-full h-1.5 accent-primary-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-ink-400">
                  <span>1 - Poor</span>
                  <span>10 - Excellent</span>
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
                onClick={() => navigate(ROUTES.HOME)}
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
