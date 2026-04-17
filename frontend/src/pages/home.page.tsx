import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setRoles } from '../store/slices/roles.slice';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Card from '../components/card.component';
import { Eye, FileText, BookOpen } from 'lucide-react';
import { roleService } from '../services/role.service';
import { useUser } from '../hooks/useUser';
import { useIsReviewer, useRoles } from '../hooks/useRoles';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useUser();
  const rolesData = useRoles();
  const isReviewer = useIsReviewer();

  useEffect(() => {
    const initializeRolesData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token || !userData) {
        navigate(ROUTES.LANDING);
        return;
      }

      if (rolesData?.length) return;

      try {
        const fetchedRoles = await roleService.getRolesByUserId(userData._id);
        dispatch(setRoles(fetchedRoles));
      } catch (error) {
        toast.error(
          extractErrorMessage(
            error,
            'An error occurred loading your roles. Please refresh the page.'
          )
        );
      }
    };

    initializeRolesData();
  }, [navigate, dispatch, userData, rolesData]);

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-10 py-12">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Welcome
            {userData?._name ? `, ${userData._name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-ink-500 text-sm">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            icon={<FileText className="h-5 w-5" />}
            title="Submit Article"
            description="Submit a new article for conference review and publication."
            iconTone="primary"
            className="cursor-pointer"
            onClick={() => navigate(ROUTES.SUBMIT_ARTICLE)}
          />

          <Card
            icon={<BookOpen className="h-5 w-5" />}
            title="My Articles"
            description="View and manage the articles you have submitted so far."
            iconTone="ink"
            className="cursor-pointer"
            onClick={() => navigate(ROUTES.MY_ARTICLES)}
          />

          {isReviewer && (
            <Card
              icon={<Eye className="h-5 w-5" />}
              title="Review Article"
              description="Review submitted articles and provide your expert feedback."
              iconTone="accent"
              className="cursor-pointer"
              onClick={() => navigate(ROUTES.SUBMIT_REVIEW)}
            />
          )}

          {isReviewer && (
            <Card
              icon={<Eye className="h-5 w-5" />}
              title="My Reviews"
              description="See all reviews you have submitted for conference articles."
              iconTone="accent"
              className="cursor-pointer"
              onClick={() => navigate(ROUTES.MY_REVIEWS)}
            />
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
