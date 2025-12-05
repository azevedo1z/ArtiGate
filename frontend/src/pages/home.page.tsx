import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/my.store';
import { setRoles } from '../store/slices/roles.slice';
import { RolesData } from '../shared/types/types.shared';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Card from '../components/card.component';
import { Eye, FileText } from 'lucide-react';

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
        const fetchedRoles: RolesData[] = await fetchRolesData(
          token,
          userData._id
        );
        dispatch(setRoles(fetchedRoles));
      } catch {
        toast.error(
          'An error occurred loading your roles. Please refresh the page.'
        );
      }
    };

    initializeRolesData();
  }, [navigate, dispatch, userData, rolesData]);

  const fetchRolesData = async (token: string, userId: string) => {
    const rolesResponse = await fetch(`http://localhost:3000/role/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!rolesResponse.ok) throw new Error();

    return await rolesResponse.json();
  };

  return (
    <Wrapper>
      <Container size="lg" className="space-y-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to ArtiGate
            </h1>
            <p className="text-gray-600 mt-2">
              {userData?._name
                ? `Hello, ${userData._name}.`
                : 'Oops, something went wrong... :('}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <Card
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Submit your article"
            description="Submit new articles for conference review and publication."
            iconColor="blue"
            className="cursor-pointer hover:scale-105 transform transition-all duration-200"
            onClick={() =>
              toast('Article submission coming soon!', { icon: 'ℹ️' })
            }
          />

          {isReviewer && (
            <Card
              icon={<Eye className="h-6 w-6 text-white" />}
              title="Review an article"
              description="Review submitted articles and provide feedback to authors."
              iconColor="purple"
              className="cursor-pointer hover:scale-105 transform transition-all duration-200"
              onClick={() =>
                toast('Article review coming soon!', { icon: 'ℹ️' })
              }
            />
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
