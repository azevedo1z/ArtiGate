import React, { useState } from 'react';
import Input from '../components/input.component';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/user/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();
      handleLogin(data, response.ok);
    } catch {
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (data: LoginResponse, success: boolean) => {
    if (success) {
      toast.success('Login successful! Welcome back.');
      localStorage.setItem('access_token', data.access_token);
      setTimeout(() => navigate('/home'), 1000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Wrapper>
      <Container size="sm" noDefaultPadding className="max-w-md space-y-8 px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to your ArtiGate account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              authLogin(email, password);
            }}
          >
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leadingIcon={<Mail className="h-4 w-4 text-gray-500" />}
              required
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leadingIcon={<Lock className="h-4 w-4 text-gray-500" />}
              trailingIcon={
                showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )
              }
              onTrailingIconClick={() => setShowPassword(!showPassword)}
              required
            />

            <div className="space-y-4">
              <Button
                type="submit"
                variantClassName="gradient"
                fullWidth
                isLoading={isLoading}
                loadingText="Signing in..."
                leadingIcon={<LogIn className="h-5 w-5" />}
              >
                Sign in
              </Button>

              <Button
                type="button"
                variantClassName="secondary"
                fullWidth
                onClick={() => navigate('/')}
                leadingIcon={<ArrowLeft className="h-5 w-5" />}
              >
                Go back
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Sign up here
            </button>
          </p>
        </div>
      </Container>
    </Wrapper>
  );
};

export default LoginPage;
