import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface MatchDetails {
  _id: string;
  user: {
    _id: string;
    name: string;
    title: string;
    bio: string;
    profileType: string;
    experience: string;
    skills: string[];
    avatarUrl?: string;
    location: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  job?: {
    _id: string;
    title: string;
    company: string;
    description: string;
    jobType: string;
    expLevel: string;
    location: string;
    remote: boolean;
    skills: string[];
  };
  matchScore: number;
  matchReasons: string[];
  status: string;
  createdAt: string;
}

function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matching/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMatch(response.data);
      } catch (err) {
        console.error('Error fetching match details:', err);
        setError('Failed to load match details. Please try again later.');
        toast.error('Failed to load match details');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    setUpdatingStatus(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/matching/${id}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setMatch(prev => prev ? {...prev, status} : null);
      toast.success(`Match ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      
      // If accepted, offer to start a conversation
      if (status === 'accepted') {
        const shouldStartConversation = window.confirm('Would you like to start a conversation with this match?');
        if (shouldStartConversation && match) {
          navigate(`/messages/${match.user._id}`);
        }
      }
    } catch (err) {
      console.error(`Error ${status === 'accepted' ? 'accepting' : 'rejecting'} match:`, err);
      toast.error(`Failed to ${status === 'accepted' ? 'accept' : 'reject'} match. Please try again.`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-xl text-red-600 mb-4">{error || 'Match not found'}</h2>
          <Link to="/matches">
            <Button variant="primary">Return to Matches</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/matches" className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Matches
        </Link>
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Match Details</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            match.status === 'accepted' ? 'bg-green-100 text-green-800' :
            match.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
          </span>
        </div>
        
        <div className="mb-6 bg-blue-50 rounded-lg p-4 flex items-center">
          <div className="mr-4 bg-blue-100 rounded-full p-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-800">
              {Math.round(match.matchScore * 100)}% Match
            </h2>
            <p className="text-blue-600">
              This is a {match.matchScore >= 0.8 ? 'strong' : match.matchScore >= 0.6 ? 'good' : 'moderate'} match based on skills and preferences
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Profile Card */}
          <Card>
            <div className="flex items-start mb-4">
              {match.user.avatarUrl ? (
                <img
                  src={match.user.avatarUrl}
                  alt={`${match.user.name}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-2xl text-gray-500">{match.user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-bold">
                  <Link to={`/profile/${match.user._id}`} className="text-primary-600 hover:text-primary-700">
                    {match.user.name}
                  </Link>
                </h2>
                <p className="text-gray-600">{match.user.title}</p>
                <p className="text-gray-500 text-sm mt-1">{match.user.location}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {match.user.profileType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {match.user.experience}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Bio:</h3>
              <p className="text-gray-600 text-sm">{match.user.bio}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {match.user.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              {match.user.linkedinUrl && (
                <a href={match.user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              
              {match.user.githubUrl && (
                <a href={match.user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
              
              {match.user.portfolioUrl && (
                <a href={match.user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          </Card>
          
          {/* Job Details Card (if job exists) */}
          {match.job ? (
            <Card>
              <h2 className="text-xl font-bold mb-2">
                <Link to={`/jobs/${match.job._id}`} className="text-primary-600 hover:text-primary-700">
                  {match.job.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{match.job.company} • {match.job.location} {match.job.remote ? '(Remote)' : ''}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {match.job.jobType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {match.job.expLevel}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Description:</h3>
                <p className="text-gray-600 text-sm line-clamp-4">{match.job.description}</p>
                <Link to={`/jobs/${match.job._id}`} className="text-primary-600 hover:text-primary-700 text-sm mt-1 inline-block">
                  Read full description
                </Link>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {match.job.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-600 mb-1">General Match</h3>
                  <p className="text-gray-500 text-sm">
                    This is a direct profile match, not related to a specific job posting.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Match Reasons Card */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Why We Matched You</h2>
          <ul className="space-y-2">
            {match.matchReasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        {/* Action Buttons */}
        {match.status === 'pending' && (
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              loading={updatingStatus}
              onClick={() => handleUpdateStatus('accepted')}
            >
              Accept Match
            </Button>
            <Button
              variant="danger"
              loading={updatingStatus}
              onClick={() => handleUpdateStatus('rejected')}
            >
              Reject Match
            </Button>
          </div>
        )}
        
        {match.status === 'accepted' && (
          <div className="flex flex-wrap gap-4">
            <Link to={`/messages/${match.user._id}`}>
              <Button variant="primary">
                Message {match.user.name.split(' ')[0]}
              </Button>
            </Link>
            <Link to={`/profile/${match.user._id}`}>
              <Button variant="outline">
                View Full Profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchDetails; 