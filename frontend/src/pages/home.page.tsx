import React from 'react';
import Button from '../components/button.component';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      Join now.
      <Button onClick={() => navigate('/login')}>Log in</Button>
    </div>
  );
};

export default HomePage;
