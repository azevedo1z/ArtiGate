import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, LogIn } from 'lucide-react';
import { setUser } from '../store/slices/user.slice';
import { resetUserSession } from '../store/session.actions';
import Input from '../components/input.component';
import Button from '../components/button.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { authService } from '../services/auth.service';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      dispatch(resetUserSession());

      const signInData = await authService.signIn(email, password);
      authService.setToken(signInData.access_token);

      const userData = await authService.getCurrentUser();
      dispatch(setUser(userData));

      toast.success('Welcome back.');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          'An error occurred during login. Please try again or check your credentials.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Container size="sm" noDefaultPadding className="max-w-md space-y-8 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Welcome back
          </h1>
          <p className="text-ink-500 text-sm">
            Sign in to continue to your ArtiGate workspace.
          </p>
        </div>

        <div className="bg-snow p-8 rounded-lg border border-ink-100">
          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leadingIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leadingIcon={<Lock className="h-4 w-4" />}
              trailingIcon={
                showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
              onTrailingIconClick={() => setShowPassword(!showPassword)}
              required
            />

            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                variantClassName="primary"
                fullWidth
                isLoading={isLoading}
                loadingText="Signing in..."
                leadingIcon={<LogIn className="h-4 w-4" />}
              >
                Sign in
              </Button>

              <Button
                type="button"
                variantClassName="secondary"
                fullWidth
                onClick={() => navigate(ROUTES.LANDING)}
                leadingIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Go back
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-ink-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate(ROUTES.SIGNUP)}
              className="font-medium text-primary-500 hover:text-primary-600 transition-colors duration-150"
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
