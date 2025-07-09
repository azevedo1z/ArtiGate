import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';

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
      navigate('/login');
      return;
    }

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
  return (
    <Wrapper variant="gradient">
      <Container size="lg" className="space-y-8 py-8">
        <div></div>
      </Container>
    </Wrapper>
  );
};
export default HomePage;
