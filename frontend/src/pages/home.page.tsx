import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { setRoles } from '../store/slices/roles.slice';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Card from '../components/card.component';
import { Eye, FileText, BookOpen } from 'lucide-react';
import { roleService } from '../services/role.service';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.data);
  const rolesData = useSelector((state: RootState) => state.roles.data);

  const isReviewer =
    rolesData?.some((role) => role._name?.includes('REVIEWER')) ?? false;

  useEffect(() => {
    const initializeRolesData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token || !userData) {
        navigate('/');
        return;
      }

      if (rolesData?.length) return;

      try {
        const fetchedRoles = await roleService.getRolesByUserId(userData._id);
        dispatch(setRoles(fetchedRoles));
      } catch {
        toast.error(
          'An error occurred loading your roles. Please refresh the page.'
        );
      }
    };

    initializeRolesData();
  }, [navigate, dispatch, userData, rolesData]);

  return (
    <Wrapper centered={false}>
      <Container size="lg" className="space-y-10 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome
            {userData?._name ? `, ${userData._name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Submit Article"
            description="Submit a new article for conference review and publication."
            iconColor="blue"
            className="cursor-pointer hover:scale-[1.02] transform transition-all duration-200"
            onClick={() => navigate('/submit-article')}
          />

          <Card
            icon={<BookOpen className="h-6 w-6 text-white" />}
            title="My Articles"
            description="View and manage the articles you have submitted so far."
            iconColor="indigo"
            className="cursor-pointer hover:scale-[1.02] transform transition-all duration-200"
            onClick={() => navigate('/my-articles')}
          />

          {isReviewer && (
            <Card
              icon={<Eye className="h-6 w-6 text-white" />}
              title="Review Article"
              description="Review submitted articles and provide your expert feedback."
              iconColor="purple"
              className="cursor-pointer hover:scale-[1.02] transform transition-all duration-200"
              onClick={() => navigate('/submit-review')}
            />
          )}

          {isReviewer && (
            <Card
              icon={<Eye className="h-6 w-6 text-white" />}
              title="My Reviews"
              description="See all reviews you have submitted for conference articles."
              iconColor="indigo"
              className="cursor-pointer hover:scale-[1.02] transform transition-all duration-200"
              onClick={() => navigate('/my-reviews')}
            />
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
