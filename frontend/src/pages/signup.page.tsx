import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button.component';
import Input from '../components/input.component';
import Container from '../components/container.component';
import Wrapper from '../components/wrapper.component';
import Select from '../components/select.component';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Calendar,
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  HomeIcon,
} from 'lucide-react';

interface SignUpResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
}

interface Role {
  id: string;
  name: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  roles: string[];

  homeZipCode: string;
  homeStreet: string;
  homeComplement: string;
  homeNeighborhood: string;
  homeCity: string;
  homeState: string;

  jobZipCode: string;
  jobStreet: string;
  jobComplement: string;
  jobNeighborhood: string;
  jobCity: string;
  jobState: string;

  // mocked
  cardNumber: string;
  cardExpiry: string;
  cardBrand: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
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
    roles: [],
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
    cardNumber: '',
    cardExpiry: '',
    cardBrand: 'Visa',
  });

  const roleOptions = [
    { value: 'AUTHOR', label: 'Author', disabled: true },
    { value: 'REVIEWER', label: 'Reviewer' },
  ];

  const cardBrandOptions = [
    { value: 'Visa', label: 'Visa' },
    { value: 'Mastercard', label: 'Mastercard' },
    { value: 'American Express', label: 'American Express' },
  ];

  const handleInputChange = (
    field: keyof SignUpFormData,
    value: string | string[]
  ) => {
    setFormData((previousValue) => ({ ...previousValue, [field]: value }));
  };

  const toggleRole = (roleValue: string) => {
    const role = roleOptions.find((option) => option.value === roleValue);

    if (role?.disabled) return;

    const updatedRoles = formData.roles.includes(roleValue)
      ? formData.roles.filter((r) => r !== roleValue)
      : [...formData.roles, roleValue];

    handleInputChange('roles', updatedRoles);
  };

  const isFormValid = (): boolean => {
    if (formData.password !== formData.passwordConfirmation) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.roles.length === 0) {
      toast.error('Please select at least one role');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          roleIds: formData.roles,
          homeAddress: {
            zipCode: formData.homeZipCode,
            street: formData.homeStreet,
            complement: formData.homeComplement,
            neighborhood: formData.homeNeighborhood,
            city: formData.homeCity,
            state: formData.homeState,
          },
          jobAddress: {
            zipCode: formData.jobZipCode,
            street: formData.jobStreet,
            complement: formData.jobComplement,
            neighborhood: formData.jobNeighborhood,
            city: formData.jobCity,
            state: formData.jobState,
          },
          badgeUrl: '',
        }),
      });

      const data: SignUpResponse = await response.json();
      handleRegistration(data, response.ok);
    } catch {
      toast.error('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = (data: SignUpResponse, success: boolean) => {
    if (success) {
      toast.success('Account created successfully! Welcome to ArtiGate.');
      localStorage.setItem('access_token', data.access_token);
      setTimeout(() => navigate('/home'), 1000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Wrapper variant="gradient">
      <Container
        size="md"
        noDefaultPadding
        className="max-w-4xl space-y-8 px-4 py-8"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join ArtiGate
          </h1>
          <p className="text-gray-600">
            Create your account to start submitting and reviewing articles.
            You're an author by default though ;D
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <User className="inline h-5 w-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  leadingIcon={<User className="h-4 w-4 text-gray-500" />}
                  required
                />

                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  leadingIcon={<Mail className="h-4 w-4 text-gray-500" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  leadingIcon={<Phone className="h-4 w-4 text-gray-500" />}
                  required
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Role(s) *
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {roleOptions.map((role) => (
                      <label
                        key={role.value}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.roles.includes(role.value)}
                          onChange={() => toggleRole(role.value)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={role.disabled}
                        />
                        <span className="text-sm text-gray-700">
                          {role.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
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

                <Input
                  id="passwordConfirmation"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.passwordConfirmation}
                  onChange={(e) =>
                    handleInputChange('passwordConfirmation', e.target.value)
                  }
                  leadingIcon={<Lock className="h-4 w-4 text-gray-500" />}
                  trailingIcon={
                    showPasswordConfirmation ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )
                  }
                  onTrailingIconClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <HomeIcon className="inline h-5 w-5 mr-2" />
                Home Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  id="homeZipCode"
                  type="text"
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={formData.homeZipCode}
                  onChange={(e) =>
                    handleInputChange('homeZipCode', e.target.value)
                  }
                  leadingIcon={<MapPin className="h-4 w-4 text-gray-500" />}
                  required
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <Input
                id="homeState"
                type="text"
                label="State"
                placeholder="Enter state"
                value={formData.homeState}
                onChange={(e) => handleInputChange('homeState', e.target.value)}
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

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <Building className="inline h-5 w-5 mr-2" />
                Work Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  id="jobZipCode"
                  type="text"
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={formData.jobZipCode}
                  onChange={(e) =>
                    handleInputChange('jobZipCode', e.target.value)
                  }
                  leadingIcon={<MapPin className="h-4 w-4 text-gray-500" />}
                  required
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <Input
                id="jobState"
                type="text"
                label="State"
                placeholder="Enter state"
                value={formData.jobState}
                onChange={(e) => handleInputChange('jobState', e.target.value)}
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

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                <CreditCard className="inline h-5 w-5 mr-2" />
                Payment Information (Mock)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="cardNumber"
                  type="text"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange('cardNumber', e.target.value)
                  }
                  leadingIcon={<CreditCard className="h-4 w-4 text-gray-500" />}
                  required
                />

                <Input
                  id="cardExpiry"
                  type="text"
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={(e) =>
                    handleInputChange('cardExpiry', e.target.value)
                  }
                  leadingIcon={<Calendar className="h-4 w-4 text-gray-500" />}
                  required
                />
              </div>

              <Select
                id="cardBrand"
                placeholder="Select card brand"
                options={cardBrandOptions}
                value={formData.cardBrand}
                onChange={(e) => handleInputChange('cardBrand', e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-6">
              <Button
                type="submit"
                variantClassName="gradient"
                fullWidth
                isLoading={isLoading}
                loadingText="Creating account..."
                leadingIcon={<UserPlus className="h-5 w-5" />}
              >
                Create Account
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
      </Container>
    </Wrapper>
  );
};

export default SignUpPage;
