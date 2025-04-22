import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 