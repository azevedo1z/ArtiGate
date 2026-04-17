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
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Frown className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            404 — Page not found
          </h1>
          <p className="text-gray-500 mt-2">
            The page you are looking for does not exist.
          </p>
        </div>
        <Button
          variantClassName="primary"
          onClick={() => navigate(ROUTES.HOME)}
          leadingIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back home
        </Button>
      </Container>
    </Wrapper>
  );
};

export default NotFoundPage;
