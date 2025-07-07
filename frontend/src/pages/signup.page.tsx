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
} from 'lucide-react';

interface SignUpResponse {
  access_token: string;
  statusCode: number;
  message: string;
  error: string;
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
    { value: 'AUTHOR', label: 'Author' },
    { value: 'REVIEWER', label: 'Reviewer' },
  ];

  const cardBrandOptions = [
    { value: 'Visa', label: 'Visa' },
    { value: 'Mastercard', label: 'Mastercard' },
    { value: 'American Express', label: 'American Express' },
  ];

 
};

export default SignUpPage;
