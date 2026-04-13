import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FileText, ArrowLeft, Plus, Trash2, Send, Users } from 'lucide-react';
import Button from '../components/button.component';
import Textarea from '../components/textarea.component';
import Input from '../components/input.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { RootState } from '../store/my.store';
import { articleService } from '../services/article.service';

const SubmitArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.user.data);

  const [summary, setSummary] = useState('');
  const [coAuthorIds, setCoAuthorIds] = useState<string[]>([]);
  const [coAuthorInput, setCoAuthorInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addCoAuthor = () => {
    const trimmed = coAuthorInput.trim();

    if (!trimmed) return;

    if (coAuthorIds.includes(trimmed)) {
      toast.error('This author ID is already added.');
      return;
    }

    setCoAuthorIds((prev) => [...prev, trimmed]);
    setCoAuthorInput('');
  };

  const removeCoAuthor = (id: string) => {
    setCoAuthorIds((prev) => prev.filter((a) => a !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?._id) {
      toast.error('User session not found. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const authorIds = [userData._id, ...coAuthorIds];
      await articleService.createArticle({ summary, authorIds });
      toast.success('Article submitted successfully!');
      navigate('/my-articles');
    } catch {
      toast.error('Failed to submit article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper centered={false}>
      <Container size="sm" noDefaultPadding className="space-y-8 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Submit Article
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Submit your article for conference review.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <form onSubmit={handleSubmit}>
            <section className="p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Abstract
                </h2>
              </div>
              <Textarea
                id="summary"
                label="Summary *"
                placeholder="Write a comprehensive abstract of your article..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                required
              />
            </section>

            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Authors
                </h2>
              </div>

              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {userData?._name ?? 'You'}
                  </p>
                  <p className="text-xs text-blue-400 font-mono mt-0.5 truncate max-w-xs">
                    {userData?._id}
                  </p>
                </div>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                  Primary
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Add co-authors by their user ID (optional)
                </p>
                <div className="flex gap-2">
                  <Input
                    id="coAuthorInput"
                    type="text"
                    label=""
                    placeholder="Co-author user ID"
                    value={coAuthorInput}
                    onChange={(e) => setCoAuthorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCoAuthor();
                      }
                    }}
                  />
                  <div className="pt-0 flex items-end">
                    <Button
                      type="button"
                      variantClassName="secondary"
                      onClick={addCoAuthor}
                      leadingIcon={<Plus className="h-4 w-4" />}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {coAuthorIds.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {coAuthorIds.map((id) => (
                      <li
                        key={id}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                      >
                        <span className="text-xs font-mono text-gray-600 truncate">
                          {id}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCoAuthor(id)}
                          className="ml-3 text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                          aria-label="Remove co-author"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                Submit Article
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

export default SubmitArticlePage;
