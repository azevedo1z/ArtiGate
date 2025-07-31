import React from 'react';
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
    <Wrapper>
      <Container size="lg" className="text-center space-y-8">
        <div
          className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex
        items-center justify-center mb-8 shadow-lg"
        >
          <BookOpen className="h-10 w-10 text-white" />
        </div>

        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ArtiGate
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Submit, review, and manage conference articles seamlessly. Join
            researchers and academics worldwide.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            onClick={() => navigate('/signup')}
            variantClassName="gradient"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
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
            iconColor="purple"
          />

          <Card
            icon={<Star className="h-6 w-6 text-white" />}
            title="Registration"
            description="Seamless participant registration and management for conference attendees."
            iconColor="indigo"
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default LandingPage;
