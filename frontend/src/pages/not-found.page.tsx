import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { ROUTES } from '../config/routes.config';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Container size="sm" className="text-center space-y-6 py-24">
        <div className="mx-auto h-14 w-14 bg-ink-50 rounded-md flex items-center justify-center">
          <Frown className="h-7 w-7 text-ink-400" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Error 404
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Page not found
          </h1>
          <p className="text-ink-500 text-sm">
            The page you are looking for does not exist.
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variantClassName="primary"
            onClick={() => navigate(ROUTES.HOME)}
            leadingIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back home
          </Button>
        </div>
      </Container>
    </Wrapper>
  );
};

export default NotFoundPage;
