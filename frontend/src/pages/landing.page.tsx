import { useNavigate } from 'react-router-dom';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Card from '../components/card.component';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  BookOpen,
  Users,
  Star,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/60">
      <Container size="lg" className="text-center space-y-12 py-16">
        <div className="flex flex-col items-center gap-6">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
            <BookOpen className="h-10 w-10 text-white" />
          </div>

          <header className="space-y-4 max-w-3xl">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                ArtiGate
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
              Submit, review, and manage conference articles seamlessly.
              Join researchers and academics worldwide.
            </p>
          </header>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate('/signup')}
            variantClassName="primary"
            sizeClassName="lg"
            leadingIcon={<UserPlus className="h-5 w-5" />}
            trailingIcon={<ArrowRight className="h-5 w-5" />}
          >
            Get Started
          </Button>
          <Button
            onClick={() => navigate('/login')}
            variantClassName="secondary"
            sizeClassName="lg"
            leadingIcon={<LogIn className="h-5 w-5" />}
          >
            Sign In
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card
            icon={<BookOpen className="h-6 w-6 text-white" />}
            title="Article Submissions"
            description="Submit and manage conference articles with our streamlined submission system."
            iconColor="blue"
          />
          <Card
            icon={<Users className="h-6 w-6 text-white" />}
            title="Peer Review"
            description="Comprehensive peer review system for evaluating and improving article quality."
            iconColor="indigo"
          />
          <Card
            icon={<Star className="h-6 w-6 text-white" />}
            title="Registration"
            description="Seamless participant registration and management for conference attendees."
            iconColor="purple"
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default LandingPage;
