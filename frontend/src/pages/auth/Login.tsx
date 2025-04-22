import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { post } from '../../utils/api';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface LoginValues {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');
      
      try {
        const response = await post<LoginResponse>('/auth/login', values);
        
        if (response.success && response.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.user.id);
          setIsAuthenticated(true);
          // Redirect is handled by the router in App.tsx
        } else {
          setServerError(response.error || 'Login failed. Please try again.');
        }
      } catch (_) {
        setServerError('Login failed. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} noValidate>
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
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
        />
        
        <Button 
          type="submit" 
          fullWidth 
          loading={isLoading}
          disabled={isLoading}
          className="mt-4"
        >
          Sign In
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login; 