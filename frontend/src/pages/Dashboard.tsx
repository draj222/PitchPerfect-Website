import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../utils/api';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

interface UserStats {
  profileCompleted: boolean;
  matchesAsCandidate: number;
  jobsPosted: number;
  matchesForJobs: number;
  messagesSent: number;
  messagesReceived: number;
  unreadMessages: number;
  pendingMatches: number;
  acceptedMatches: number;
  totalMatches: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'founder' | 'engineer' | 'both';
  profileCompleted: boolean;
}

const Dashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, check if the API is running
        try {
          const healthResponse = await fetch('http://localhost:5001/health');
          if (!healthResponse.ok) {
            throw new Error('API health check failed');
          }
        } catch (err) {
          setError('Backend API is not running. Please start the backend service.');
          setLoading(false);
          return;
        }

        // Get user details
        const userResponse = await get<User>('/auth/me');
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          
          // Check if profile is complete
          if (!userResponse.data.profileCompleted) {
            setLoading(false);
            return;
          }
        }
        
        // Get user stats
        const statsResponse = await get<UserStats>('/users/stats');
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (_) {
        setError('Failed to load dashboard data. API may be running but is not fully functional.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ConnectUp Platform</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">⚠️ {error}</p>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h2 className="font-semibold text-blue-800 mb-2">Getting Started</h2>
          <p className="mb-2">To run ConnectUp properly, ensure both the frontend and backend services are running:</p>
          <ol className="list-decimal list-inside pl-2 mb-4">
            <li className="mb-1">Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm install</code> in project root</li>
            <li className="mb-1">Start both services with <code className="bg-gray-100 px-1 py-0.5 rounded">npm run dev</code></li>
            <li>Ensure MongoDB is running (optional)</li>
          </ol>
          <p className="text-sm text-blue-600">Note: The frontend is currently running on port 5173 and the backend should be on port 5001.</p>
        </div>
      </div>
    );
  }

  // If profile is not complete, show the setup prompt
  if (user && !user.profileCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to ConnectUp!</h1>
        <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-6">
          <h2 className="text-lg font-semibold text-primary-700 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600 mb-4">
            To get the most out of ConnectUp, please complete your profile first. This will help us match you with the right opportunities.
          </p>
          <Link to="/profile-setup">
            <Button>Complete Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        {user?.role !== 'engineer' && (
          <Link to="/jobs/create">
            <Button>Post a New Job</Button>
          </Link>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Matches</h2>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-primary-600">{stats.totalMatches}</div>
              <Link to="/matches" className="text-primary-600 hover:text-primary-800">
                View All
              </Link>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>Pending: {stats.pendingMatches}</div>
              <div>Accepted: {stats.acceptedMatches}</div>
            </div>
          </div>

          {user?.role !== 'engineer' && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">My Job Postings</h2>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-primary-600">{stats.jobsPosted}</div>
                <Link to="/my-jobs" className="text-primary-600 hover:text-primary-800">
                  View All
                </Link>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <div>Matches for your jobs: {stats.matchesForJobs}</div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Messages</h2>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-primary-600">{stats.unreadMessages}</div>
              <Link to="/messages" className="text-primary-600 hover:text-primary-800">
                View All
              </Link>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <div>Total: {stats.messagesSent + stats.messagesReceived}</div>
              <div>Unread: {stats.unreadMessages}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/jobs" className="block">
            <div className="border border-gray-200 hover:border-primary-500 p-4 rounded-md hover:bg-gray-50 transition-colors">
              <span className="block text-gray-700 font-medium">Browse Job Postings</span>
              <span className="text-sm text-gray-500">Find your next opportunity</span>
            </div>
          </Link>
          
          <Link to="/profile" className="block">
            <div className="border border-gray-200 hover:border-primary-500 p-4 rounded-md hover:bg-gray-50 transition-colors">
              <span className="block text-gray-700 font-medium">Update Profile</span>
              <span className="text-sm text-gray-500">Keep your profile up to date</span>
            </div>
          </Link>
          
          <Link to="/matches" className="block">
            <div className="border border-gray-200 hover:border-primary-500 p-4 rounded-md hover:bg-gray-50 transition-colors">
              <span className="block text-gray-700 font-medium">Review Matches</span>
              <span className="text-sm text-gray-500">See who you've matched with</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 