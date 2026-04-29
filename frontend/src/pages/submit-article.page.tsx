import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Users,
  UploadCloud,
  X,
} from 'lucide-react';
import Button from '../components/button.component';
import Textarea from '../components/textarea.component';
import Input from '../components/input.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { articleService } from '../services/article.service';
import { useUser } from '../hooks/useUser';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';
import { formatBytes } from '../utils/helpers.util';
import { validatePdfFile } from '../utils/helpers.util';

const SubmitArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const userData = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [summary, setSummary] = useState('');
  const [coAuthorIds, setCoAuthorIds] = useState<string[]>([]);
  const [coAuthorInput, setCoAuthorInput] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }
    const error = validatePdfFile(file);
    if (error) {
      toast.error(error);
      clearFile();
      return;
    }
    setPdfFile(file);
  };

  const clearFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData?._id) {
      toast.error('User session not found. Please log in again.');
      return;
    }

    if (!pdfFile) {
      toast.error('Please attach the article PDF.');
      return;
    }

    const fileError = validatePdfFile(pdfFile);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    setIsLoading(true);

    try {
      const authorIds = [userData._id, ...coAuthorIds];
      await articleService.createArticle({
        summary,
        authorIds,
        pdf: pdfFile,
      });
      toast.success('Article submitted successfully.');
      navigate(ROUTES.MY_ARTICLES);
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          'Failed to submit article. Please try again.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper centered={false}>
      <Container size="sm" noDefaultPadding className="space-y-8 px-4 py-10">
        <div className="space-y-1">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            New submission
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Submit Article
          </h1>
          <p className="text-ink-500 text-sm">
            Provide your abstract, list of authors and the article PDF.
          </p>
        </div>

        <div className="bg-snow rounded-lg border border-ink-100 divide-y divide-ink-100">
          <form onSubmit={handleSubmit}>
            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
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
              <div className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  PDF attachment *
                </h2>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pdfFile"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink-200 rounded-md px-4 py-6 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
                >
                  <UploadCloud className="h-6 w-6 text-ink-400" />
                  <p className="text-sm font-medium text-ink-700">
                    {pdfFile ? 'Replace PDF file' : 'Click to upload PDF'}
                  </p>
                  <p className="text-[11px] text-ink-400">PDF only</p>
                  <input
                    ref={fileInputRef}
                    id="pdfFile"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {pdfFile && (
                  <div className="flex items-center justify-between bg-ink-50 border border-ink-100 rounded-md px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-700 truncate">
                          {pdfFile.name}
                        </p>
                        <p className="text-[11px] text-ink-400">
                          {formatBytes(pdfFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="ml-3 text-ink-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Authors
                </h2>
              </div>

              <div className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-md px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-primary-800">
                    {userData?._name ?? 'You'}
                  </p>
                  <p className="text-[11px] text-primary-400 font-mono mt-0.5 truncate max-w-xs">
                    {userData?._id}
                  </p>
                </div>
                <span className="text-[11px] bg-primary-500 text-snow px-2 py-0.5 rounded-full font-medium tracking-wide uppercase">
                  Primary
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-ink-500">
                  Add co-authors by their user ID (optional)
                </p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      id="coAuthorInput"
                      type="text"
                      label=""
                      placeholder="Co-author user ID"
                      mask="********-****-****-****-************"
                      value={coAuthorInput}
                      onChange={(e) => setCoAuthorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCoAuthor();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variantClassName="secondary"
                    onClick={addCoAuthor}
                    leadingIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>

                {coAuthorIds.length > 0 && (
                  <ul className="space-y-2 mt-2">
                    {coAuthorIds.map((id) => (
                      <li
                        key={id}
                        className="flex items-center justify-between bg-ink-50 border border-ink-100 rounded-md px-4 py-2"
                      >
                        <span className="text-[11px] font-mono text-ink-600 truncate">
                          {id}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCoAuthor(id)}
                          className="ml-3 text-ink-400 hover:text-red-500 transition-colors flex-shrink-0"
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

export default SubmitArticlePage;
