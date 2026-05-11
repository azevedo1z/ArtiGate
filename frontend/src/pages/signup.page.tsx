import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  HomeIcon,
  Loader2,
} from 'lucide-react';
import Button from '../components/button.component';
import Input from '../components/input.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import { ROLE_OPTIONS } from '../utils/constants.util';
import {
  AddressPrefix,
  SignUpFormData,
  ZipCodeLookupResult,
} from '../shared/types/types.shared';
import { prepareUserData } from '../utils/helpers.util';
import { setUser } from '../store/slices/user.slice';
import { resetUserSession } from '../store/session.actions';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { roleService } from '../services/role.service';
import { ROUTES } from '../config/routes.config';
import { extractErrorMessage } from '../utils/error.util';
import { useZipCodeLookup } from '../hooks/useZipCodeLookup';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    roles: ['AUTHOR'],
    homeZipCode: '',
    homeStreet: '',
    homeComplement: '',
    homeNeighborhood: '',
    homeCity: '',
    homeState: '',
    jobZipCode: '',
    jobStreet: '',
    jobComplement: '',
    jobNeighborhood: '',
    jobCity: '',
    jobState: '',
  });

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | string[]
  ) => {
    setFormData((previousValue) => ({ ...previousValue, [field]: value }));
  };

  const applyAddressLookup = (
    prefix: AddressPrefix,
    data: ZipCodeLookupResult
  ) => {
    setFormData((previousValue) => ({
      ...previousValue,
      [`${prefix}Street`]: data.street,
      [`${prefix}Neighborhood`]: data.neighborhood,
      [`${prefix}City`]: data.city,
      [`${prefix}State`]: data.state,
    }));
  };

  const { isLoading: isHomeZipCodeLoading } = useZipCodeLookup(
    formData.homeZipCode,
    {
      onSuccess: (data) => applyAddressLookup('home', data),
      onError: (message) => toast.error(message),
    }
  );

  const { isLoading: isJobZipCodeLoading } = useZipCodeLookup(
    formData.jobZipCode,
    {
      onSuccess: (data) => applyAddressLookup('job', data),
      onError: (message) => toast.error(message),
    }
  );

  const toggleRole = (roleValue: string) => {
    const role = ROLE_OPTIONS.find((option) => option.value === roleValue);

    if (role?.disabled) return;

    const updatedRoles = formData.roles.includes(roleValue)
      ? formData.roles.filter((r) => r !== roleValue)
      : [...formData.roles, roleValue];

    handleInputChange('roles', updatedRoles);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordMatching()) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const roleIds = await fetchRoleIds(formData.roles);

      if (roleIds.length === 0) {
        toast.error('No matching role IDs found');
        return;
      }

      await userService.createUser(prepareUserData(formData, roleIds));

      dispatch(resetUserSession());

      const signInData = await authService.signIn(
        formData.email,
        formData.password
      );
      authService.setToken(signInData.access_token);

      const userData = await authService.getCurrentUser();
      dispatch(setUser(userData));

      toast.success('Account created successfully. Welcome to ArtiGate.');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          'An error occurred during signup. Please try again.'
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordMatching = (): boolean => {
    return formData.password !== formData.passwordConfirmation ? false : true;
  };

  const fetchRoleIds = async (roleNames: string[]): Promise<string[]> => {
    try {
      const rolesData = await roleService.getAllRoles();
      const roleIds = roleNames
        .map((name) => rolesData.find((role) => role._name === name)?._id)
        .filter(Boolean) as string[];

      return roleIds;
    } catch {
      toast.error('Failed to load roles');
      return [];
    }
  };

  const iconClass = 'h-4 w-4 text-ink-400';

  return (
    <Wrapper centered={false}>
      <Container
        size="md"
        noDefaultPadding
        className="max-w-4xl space-y-8 px-4 py-10"
      >
        <div className="space-y-1">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Create account
          </p>
          <h1 className="text-3xl font-semibold text-ink-800 tracking-tight">
            Join ArtiGate
          </h1>
          <p className="text-ink-500 text-sm">
            Set up your account to submit and review articles. You're an author
            by default.
          </p>
        </div>

        <div className="bg-snow rounded-lg border border-ink-100 divide-y divide-ink-100">
          <form onSubmit={handleRegistration}>
            <section className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  leadingIcon={<User className={iconClass} />}
                  required
                />

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  leadingIcon={<Mail className={iconClass} />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  leadingIcon={<Phone className={iconClass} />}
                  required
                  mask="+9-999-999-9999"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-600 uppercase tracking-wide block">
                    Role(s) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                    {ROLE_OPTIONS.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-center gap-2 text-sm ${
                          role.disabled
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(role.value)}
                          onChange={() => toggleRole(role.value)}
                          className="rounded border-ink-300 text-primary-500 focus:ring-primary-500"
                          disabled={role.disabled}
                        />
                        <span className="text-ink-700">{role.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  leadingIcon={<Lock className={iconClass} />}
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

                <Input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.passwordConfirmation}
                  onChange={(e) =>
                    handleInputChange('passwordConfirmation', e.target.value)
                  }
                  leadingIcon={<Lock className={iconClass} />}
                  trailingIcon={
                    showPasswordConfirmation ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )
                  }
                  onTrailingIconClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                  required
                />
              </div>
            </section>

            <section className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Home Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  id="homeZipCode"
                  type="text"
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={formData.homeZipCode}
                  onChange={(e) =>
                    handleInputChange('homeZipCode', e.target.value)
                  }
                  leadingIcon={<MapPin className={iconClass} />}
                  trailingIcon={
                    isHomeZipCodeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null
                  }
                  required
                  mask="99999-999"
                />

                <div className="md:col-span-2">
                  <Input
                    id="homeStreet"
                    type="text"
                    label="Street Address"
                    placeholder="Enter street address"
                    value={formData.homeStreet}
                    onChange={(e) =>
                      handleInputChange('homeStreet', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  id="homeComplement"
                  type="text"
                  label="Complement"
                  placeholder="Apt, suite, etc."
                  value={formData.homeComplement}
                  onChange={(e) =>
                    handleInputChange('homeComplement', e.target.value)
                  }
                />

                <Input
                  id="homeNeighborhood"
                  type="text"
                  label="Neighborhood"
                  placeholder="Enter neighborhood"
                  value={formData.homeNeighborhood}
                  onChange={(e) =>
                    handleInputChange('homeNeighborhood', e.target.value)
                  }
                  required
                />

                <Input
                  id="homeCity"
                  type="text"
                  label="City"
                  placeholder="Enter city"
                  value={formData.homeCity}
                  onChange={(e) =>
                    handleInputChange('homeCity', e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="homeState"
                  type="text"
                  label="State"
                  placeholder="Enter state"
                  value={formData.homeState}
                  onChange={(e) =>
                    handleInputChange('homeState', e.target.value)
                  }
                  required
                />

                <Input
                  id="homeCountry"
                  type="text"
                  label="Country"
                  placeholder="Brasil"
                  disabled
                />
              </div>
            </section>

            <section className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-ink-400" />
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  Work Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  id="jobZipCode"
                  type="text"
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={formData.jobZipCode}
                  onChange={(e) =>
                    handleInputChange('jobZipCode', e.target.value)
                  }
                  leadingIcon={<MapPin className={iconClass} />}
                  trailingIcon={
                    isJobZipCodeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null
                  }
                  required
                  mask="99999-999"
                />

                <div className="md:col-span-2">
                  <Input
                    id="jobStreet"
                    type="text"
                    label="Street Address"
                    placeholder="Enter work address"
                    value={formData.jobStreet}
                    onChange={(e) =>
                      handleInputChange('jobStreet', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  id="jobComplement"
                  type="text"
                  label="Complement"
                  placeholder="Floor, room, etc."
                  value={formData.jobComplement}
                  onChange={(e) =>
                    handleInputChange('jobComplement', e.target.value)
                  }
                />

                <Input
                  id="jobNeighborhood"
                  type="text"
                  label="Neighborhood"
                  placeholder="Enter neighborhood"
                  value={formData.jobNeighborhood}
                  onChange={(e) =>
                    handleInputChange('jobNeighborhood', e.target.value)
                  }
                  required
                />

                <Input
                  id="jobCity"
                  type="text"
                  label="City"
                  placeholder="Enter city"
                  value={formData.jobCity}
                  onChange={(e) => handleInputChange('jobCity', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  id="jobState"
                  type="text"
                  label="State"
                  placeholder="Enter state"
                  value={formData.jobState}
                  onChange={(e) =>
                    handleInputChange('jobState', e.target.value)
                  }
                  required
                />

                <Input
                  id="jobCountry"
                  type="text"
                  label="Country"
                  placeholder="Brasil"
                  disabled
                />
              </div>
            </section>

            <section className="p-6 flex gap-3">
              <Button
                type="submit"
                variantClassName="primary"
                fullWidth
                isLoading={isLoading}
                loadingText="Creating account..."
                leadingIcon={<UserPlus className="h-4 w-4" />}
              >
                Create Account
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
            </section>
          </form>
        </div>
      </Container>
    </Wrapper>
  );
};

export default SignUpPage;
