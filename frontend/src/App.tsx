import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy, useState, useEffect } from 'react';

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/ui/Spinner';

// Auth components (direct import for critical path)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfileSetup = lazy(() => import('./pages/profile/ProfileSetup'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const JobsExplore = lazy(() => import('./pages/jobs/JobsExplore'));
const JobDetails = lazy(() => import('./pages/jobs/JobDetails'));
const CreateJob = lazy(() => import('./pages/jobs/CreateJob'));
const MyJobs = lazy(() => import('./pages/jobs/MyJobs'));
const Matches = lazy(() => import('./pages/matches/Matches'));
const MatchDetails = lazy(() => import('./pages/matches/MatchDetails'));
const Messages = lazy(() => import('./pages/messages/Messages'));
const Conversation = lazy(() => import('./pages/messages/Conversation'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check for authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route index element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register setIsAuthenticated={setIsAuthenticated} />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MainLayout setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={
              <Suspense fallback={<Spinner />}>
                <Dashboard />
              </Suspense>
            } />
            
            <Route path="profile-setup" element={
              <Suspense fallback={<Spinner />}>
                <ProfileSetup />
              </Suspense>
            } />
            
            <Route path="profile/:id?" element={
              <Suspense fallback={<Spinner />}>
                <Profile />
              </Suspense>
            } />
            
            <Route path="jobs" element={
              <Suspense fallback={<Spinner />}>
                <JobsExplore />
              </Suspense>
            } />
            
            <Route path="jobs/:id" element={
              <Suspense fallback={<Spinner />}>
                <JobDetails />
              </Suspense>
            } />
            
            <Route path="jobs/create" element={
              <Suspense fallback={<Spinner />}>
                <CreateJob />
              </Suspense>
            } />
            
            <Route path="my-jobs" element={
              <Suspense fallback={<Spinner />}>
                <MyJobs />
              </Suspense>
            } />
            
            <Route path="matches" element={
              <Suspense fallback={<Spinner />}>
                <Matches />
              </Suspense>
            } />
            
            <Route path="matches/:id" element={
              <Suspense fallback={<Spinner />}>
                <MatchDetails />
              </Suspense>
            } />
            
            <Route path="messages" element={
              <Suspense fallback={<Spinner />}>
                <Messages />
              </Suspense>
            } />
            
            <Route path="messages/:id" element={
              <Suspense fallback={<Spinner />}>
                <Conversation />
              </Suspense>
            } />
          </Route>
          
          {/* 404 - Not Found */}
          <Route path="*" element={
            <Suspense fallback={<Spinner />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
