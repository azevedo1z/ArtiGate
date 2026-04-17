import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  FileText,
  Eye,
  Award,
  CheckCircle,
  Clock,
  Mail,
} from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import Card from '../components/card.component';
import { ROUTES } from '../config/routes.config';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-12 py-12">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            About
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            A conference platform built for{' '}
            <span className="text-primary-500">thoughtful review</span>
          </h1>
          <p className="text-ink-500 text-sm leading-relaxed">
            ArtiGate streamlines participant registration and article selection
            for academic conferences, connecting authors, reviewers, and
            organizers through a single clean workflow.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
              Workflow
            </p>
            <h2 className="text-2xl font-semibold text-ink-800 tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              icon={<Users className="h-5 w-5" />}
              title="Participant Registration"
              description="Participants register through web forms providing personal, contact, and payment information."
              iconTone="primary"
            />
            <Card
              icon={<CheckCircle className="h-5 w-5" />}
              title="Instant Confirmation"
              description="Upon registration, participants receive a unique number and printed badges or certificates."
              iconTone="accent"
            />
            <Card
              icon={<FileText className="h-5 w-5" />}
              title="Article Submission"
              description="Registered participants submit articles with author details, abstracts, and PDF uploads."
              iconTone="primary"
            />
            <Card
              icon={<Eye className="h-5 w-5" />}
              title="Peer Review"
              description="Articles are distributed to 5 randomly selected volunteer reviewers for evaluation."
              iconTone="accent"
            />
            <Card
              icon={<Clock className="h-5 w-5" />}
              title="5-Day Review Period"
              description="Reviewers have 5 business days to provide ratings (1-10) and detailed comments."
              iconTone="ink"
            />
            <Card
              icon={<Award className="h-5 w-5" />}
              title="Final Selection"
              description="Top 20 articles are selected based on average scores from at least 3 reviews."
              iconTone="primary"
            />
          </div>
        </div>

        <div className="bg-snow rounded-lg border border-ink-100 p-6 space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
              Capabilities
            </p>
            <h2 className="text-2xl font-semibold text-ink-800 tracking-tight">
              Key features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Automated Registration
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Web-based registration with instant confirmation and unique
                  participant numbering.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Multi-Author Support
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Support for articles with multiple authors, validated against
                  registration data.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Random Reviewer Assignment
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Fair and unbiased article distribution to qualified volunteer
                  reviewers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Email Notifications
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Instant feedback delivery to authors and automated reviewer
                  assignment notifications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-primary-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Deadline Management
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Automatic deadline tracking with fallback reviewer assignment
                  for timely reviews.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="h-4 w-4 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ink-800">
                  Merit-Based Selection
                </h3>
                <p className="text-ink-500 text-sm mt-0.5">
                  Transparent ranking system based on average reviewer scores.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
              Process
            </p>
            <h2 className="text-2xl font-semibold text-ink-800 tracking-tight">
              Review cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: '01',
                title: 'Submission',
                body: 'Participants submit articles with author details, abstracts, and PDFs.',
              },
              {
                step: '02',
                title: 'Reviewers',
                body: '5 volunteer reviewers are randomly assigned per article.',
              },
              {
                step: '03',
                title: 'Timeline',
                body: '5-day review period with a minimum of 3 reviews required.',
              },
              {
                step: '04',
                title: 'Selection',
                body: 'Top 20 articles are selected by average reviewer score.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-snow rounded-lg border border-ink-100 p-5 space-y-2"
              >
                <p className="text-[11px] font-mono text-primary-500 tracking-wider">
                  {item.step}
                </p>
                <h3 className="text-sm font-semibold text-ink-800">
                  {item.title}
                </h3>
                <p className="text-ink-500 text-xs leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            variantClassName="ghost"
            onClick={() => navigate(ROUTES.HOME)}
            leadingIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </Wrapper>
  );
};

export default AboutPage;
