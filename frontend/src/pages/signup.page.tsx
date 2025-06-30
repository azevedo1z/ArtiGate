import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button.component';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1> Welcome to ArtiGate.</h1>
      <Button onClick={() => navigate('/')}> Go back</Button>
    </div>
  );
};

export default SignUpPage;
