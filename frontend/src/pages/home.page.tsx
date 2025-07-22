import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import Card from '../components/card.component';
import { LogOut, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserData, RoleData } from '../shared/types/types.shared';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isReviewer = roleData?._name.includes('REVIEWER') ?? false;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const userResponse = await fetch('http://localhost:3000/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) throw new Error();

        const userData: UserData = await userResponse.json();
        setUserData(userData);

        const roleResponse = await fetch(
          `http://localhost:3000/role/${userData.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!roleResponse.ok) throw new Error();

        const roleData: RoleData = await roleResponse.json();
        setRoleData(roleData);
      } catch {
        toast.error(
          'An error occurred loading your data. Please refresh the page.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Container size="lg" className="py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading...</div>
          </div>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container size="lg" className="space-y-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to ArtiGate
            </h1>
            <p className="text-gray-600 mt-2">
              {userData?.name
                ? `Hello, ${userData.name}`
                : 'Oops, something went wrong... :('}
            </p>
          </div>
          <Button
            variantClassName="secondary"
            onClick={handleLogout}
            leadingIcon={<LogOut className="h-4 w-4" />}
          >
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <Card
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Submit your article"
            description="Submit new articles for conference review and publication."
            iconColor="blue"
            className="cursor-pointer hover:scale-105 transform transition-all duration-200"
            onClick={() => {
              // TODO: Navigate to article submission page
              toast('Article submission coming soon!', { icon: 'ℹ️' });
            }}
          />

          {isReviewer && (
            <Card
              icon={<Eye className="h-6 w-6 text-white" />}
              title="Review an article"
              description="Review submitted articles and provide feedback to authors."
              iconColor="purple"
              className="cursor-pointer hover:scale-105 transform transition-all duration-200"
              onClick={() => {
                // TODO: Navigate to article review page
                toast('Article review coming soon!', { icon: 'ℹ️' });
              }}
            />
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
