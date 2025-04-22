import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { post } from '../../utils/api';

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const Register = ({ setIsAuthenticated }: RegisterProps) => {
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<RegisterValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');
      
      try {
        const { confirmPassword, ...registerData } = values;
        const response = await post<RegisterResponse>('/auth/register', registerData);
        
        if (response.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user.id);
          setIsAuthenticated(true);
          // Redirect is handled by the router in App.tsx
        } else {
          setServerError(response.error || 'Registration failed. Please try again.');
        }
      } catch (_) {
        setServerError('Registration failed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} noValidate>
        <Input
          label="Name"
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
        />
        
        <Input
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
        />
        
        <Input
          label="Password"
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          helperText="Password must be at least 8 characters with one uppercase, one lowercase, and one number"
        />
        
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
        />
        
        <Button 
          type="submit" 
          fullWidth 
          loading={isLoading}
          disabled={isLoading}
          className="mt-4"
        >
          Sign Up
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register; 