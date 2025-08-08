import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  Users,
  FileText,
  Eye,
  Award,
  CheckCircle,
  Mail,
  Clock,
  Star,
} from 'lucide-react';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import Card from '../components/card.component';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Container size="lg" className="space-y-8 py-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Info className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            About ArtiGate
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A comprehensive conference management system designed to streamline
            participant registration and article selection processes for
            academic conferences.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            System Overview
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            ArtiGate is a sophisticated software solution that controls the
            execution of academic conferences, managing both participant
            registration and article selection processes. Our platform ensures
            a seamless experience from initial registration to final article
            approval.
          </p>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              icon={<Users className="h-6 w-6 text-white" />}
              title="Participant Registration"
              description="Participants register through web forms providing personal information, contact details, employment data, and payment information."
              iconColor="blue"
            />

            <Card
              icon={<CheckCircle className="h-6 w-6 text-white" />}
              title="Instant Confirmation"
              description="Upon registration, participants receive immediate confirmation with a unique registration number and printed badges/certificates."
              iconColor="green"
            />

            <Card
              icon={<FileText className="h-6 w-6 text-white" />}
              title="Article Submission"
              description="Registered participants can submit articles with author details, abstracts, and PDF uploads through our secure web interface."
              iconColor="purple"
            />

            <Card
              icon={<Eye className="h-6 w-6 text-white" />}
              title="Peer Review Process"
              description="Articles are distributed to 5 randomly selected volunteer reviewers for comprehensive evaluation and feedback."
              iconColor="indigo"
            />

            <Card
              icon={<Clock className="h-6 w-6 text-white" />}
              title="5-Day Review Period"
              description="Reviewers have 5 business days to provide ratings (1-10) and detailed comments for authors via our review portal."
              iconColor="red"
            />

            <Card
              icon={<Award className="h-6 w-6 text-white" />}
              title="Final Selection"
              description="Top 20 articles are selected based on average scores from at least 3 reviews, ensuring quality and fairness."
              iconColor="yellow"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
            <Star className="inline h-6 w-6 mr-2 text-yellow-500" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Automated Registration
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Streamlined web-based registration with instant confirmation
                    and unique participant numbering.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Multi-Author Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Support for articles with multiple authors, with automatic
                    validation against registration data.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Random Reviewer Assignment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Fair and unbiased article distribution to qualified
                    volunteer reviewers.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Automated Email Notifications
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Instant feedback delivery to authors and automated reviewer
                    assignment notifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Deadline Management
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Automatic deadline tracking with fallback reviewer
                    assignment for timely reviews.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Merit-Based Selection
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Transparent ranking system based on average reviewer scores
                    with minimum review requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Review Process Details
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                <span role="img" aria-label="memo">📝</span> Submission Requirements
              </h3>
              <p className="text-sm">
                Only registered participants can submit articles. Each
                submission requires author details, registration numbers, email
                verification, abstract, and PDF upload.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                <span role="img" aria-label="reviewers">👥</span> Reviewer Selection
              </h3>
              <p className="text-sm">
                Volunteer reviewers are randomly assigned 5 articles each.
                Reviewers must be registered participants who opted to volunteer
                during registration.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                <span role="img" aria-label="clock">⏰</span> Review Timeline
              </h3>
              <p className="text-sm">
                5-day review period with automatic reassignment if no response.
                Minimum 3 reviews required for consideration, target of 5
                reviews per article.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                <span role="img" aria-label="trophy">🏆</span> Final Selection
              </h3>
              <p className="text-sm">
                Top 20 articles selected based on average scores in descending
                order. Articles with fewer than 3 reviews are automatically
                excluded from final consideration.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            variantClassName="secondary"
            onClick={() => navigate('/home')}
            leadingIcon={<ArrowLeft className="h-5 w-5" />}
          >
            Back to Home
          </Button>
        </div>
      </Container>
    </Wrapper>
  );
};

export default AboutPage;
