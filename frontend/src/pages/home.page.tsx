import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Button from '../components/button.component';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isReviewer = userData?.roles.includes('REVIEWER') ?? false;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userData: UserData = await response.json();
        await handleUserDataFetch(userData, response.ok);
      } catch {
        toast.error(
          'An error occurred loading your data. Please refresh the page.'
        );
      } finally {
        setIsLoading(false);
      }
    };
  }, [navigate]);

  const handleUserDataFetch = async (userData: UserData, success: boolean) => {
    if (success) setUserData(userData);
    else throw new Error();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate('/');
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
              Manage your articles and reviews
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
      </Container>
    </Wrapper>
  );
};

export default HomePage;
