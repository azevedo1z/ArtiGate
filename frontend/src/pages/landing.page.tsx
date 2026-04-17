import { useNavigate } from 'react-router-dom';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Card from '../components/card.component';
import { LogIn, ArrowRight, BookOpen, Users, Star } from 'lucide-react';
import { ROUTES } from '../config/routes.config';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Container size="lg" className="text-center space-y-14 py-20">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ink-200 text-xs font-medium text-ink-500 tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Modern Scholar Platform
          </div>

          <header className="space-y-5 max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-ink-800 leading-[1.05] tracking-tight">
              Where academic work meets{' '}
              <span className="text-primary-500">thoughtful review</span>.
            </h1>
            <p className="text-lg text-ink-500 leading-relaxed max-w-2xl mx-auto">
              Submit, review, and manage conference articles with a clean,
              distraction-free workflow built for researchers.
            </p>
          </header>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={() => navigate(ROUTES.SIGNUP)}
            variantClassName="primary"
            sizeClassName="lg"
            trailingIcon={<ArrowRight className="h-4 w-4" />}
          >
            Get Started
          </Button>
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            variantClassName="ghost"
            sizeClassName="lg"
            leadingIcon={<LogIn className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          <Card
            icon={<BookOpen className="h-5 w-5" />}
            title="Article Submissions"
            description="A streamlined system for submitting conference articles with structured metadata."
            iconTone="primary"
          />
          <Card
            icon={<Users className="h-5 w-5" />}
            title="Peer Review"
            description="A comprehensive peer review flow for evaluating and improving article quality."
            iconTone="accent"
          />
          <Card
            icon={<Star className="h-5 w-5" />}
            title="Registration"
            description="Seamless participant registration and management for conference attendees."
            iconTone="ink"
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default LandingPage;
