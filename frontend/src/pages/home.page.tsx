import React, { useState } from 'react';
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

  //TODO: Search for useEffect
  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      navigate('/');
      return;
    }

    //TODO: need to retrieve the UserId from the acesstoken and add the userId param
    const response = await fetch('http://localhost:3000/user/id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const isReviewer = userData?.roles.includes('REVIEWER');

    if (isLoading) {
      return (
        <Wrapper variant="gradient">
          <Container size="md" className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </Container>
        </Wrapper>
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <Wrapper variant="gradient">
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
