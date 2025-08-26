import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { apiClient, TokenManager, APIError } from '../services/api.service';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';
import { setUser } from '../store/slices/user.slice';
import Input from '../components/input.component';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { SignInResponse, UserData } from '../shared/types/types.shared';
import { validateField } from '../utils/validation.util';
import { rateLimiter } from '../utils/rateLimiter.util';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValidation = validateField(email, 'email');

    if (!emailValidation.isValid && emailValidation.message)
      newErrors.email = emailValidation.message;

    if (!password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const authLogin = async (email: string, password: string) => {
    if (!validateForm()) return;

    if (!rateLimiter.isAllowed('login', 5, 300000)) {
      const remainingTime = Math.ceil(
        rateLimiter.getRemainingTime('login') / 60000
      );
      toast.error(
        `Too many login attempts. Please try again in ${remainingTime} minutes.`
      );
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const signInData: SignInResponse = await apiClient.post('/user/signIn', {
        email: email.trim().toLowerCase(),
        password,
      });

      await handleLogin(signInData);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 401) {
          setErrors({ general: 'Invalid email or password' });
        } else {
          setErrors({
            general: 'An error occurred during login. Please try again.',
          });
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (signInData: SignInResponse) => {
    try {
      const userData = await apiClient.get<UserData>('/user/me');
      dispatch(setUser(userData));

      TokenManager.setToken(signInData.access_token);
      toast.success('Login successful! Welcome back.');
      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      setErrors({ general: 'Failed to fetch user data. Please try again.' });
      throw error;
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
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

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
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              leadingIcon={<Mail className="h-4 w-4 text-gray-500" />}
              required
              error={errors.email}
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
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
              error={errors.password}
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
