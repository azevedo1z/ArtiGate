import React from 'react';
import Button from '../components/button.component';
import { useNavigate } from 'react-router-dom';
import Input from '../components/input.component';

interface LoginResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const authLogin = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/user/signIn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();
    handleLogin(data, response.ok);
  };

  const handleLogin = (data: LoginResponse, success: boolean) => {
    if (success) {
      localStorage.setItem('access_token', data.access_token);
      navigate('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Input
        placeholder="Type your e-mail..."
        label="E-mail"
        value={email}
        onChange={(email) => setEmail(email.target.value)}
      />
      <Input
        placeholder="Type your password..."
        label="Password"
        value={password}
        onChange={(password) => setPassword(password.target.value)}
        type="password"
      />
      <Button onClick={() => navigate('/')}> Go back</Button>
      <Button onClick={() => authLogin(email, password)}> Submit</Button>
    </div>
  );
};

export default LoginPage;
