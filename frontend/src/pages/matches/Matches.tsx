import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface Match {
  _id: string;
  user: {
    _id: string;
    name: string;
    title: string;
    profileType: string;
    experience: string;
    skills: string[];
    avatarUrl?: string;
    location: string;
  };
  job?: {
    _id: string;
    title: string;
    company: string;
    jobType: string;
    expLevel: string;
  };
  matchScore: number;
  status: string;
  createdAt: string;
}

function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/matching`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setMatches(response.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const filteredMatches = filter === 'all' 
    ? matches 
    : matches.filter(match => match.status === filter);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${filter === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            All Matches
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${filter === 'pending' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${filter === 'accepted' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${filter === 'rejected' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {filteredMatches.length === 0 ? (
        <Card className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 mb-4">No matches found</h2>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'We don\'t have any matches for you yet. Complete your profile and check back later!'
              : `You don't have any ${filter} matches at the moment.`
            }
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/profile-setup">
              <Button variant="outline">Update Profile</Button>
            </Link>
            <Link to="/jobs">
              <Button variant="primary">Browse Jobs</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMatches.map(match => (
            <Card key={match._id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  {match.user.avatarUrl ? (
                    <img
                      src={match.user.avatarUrl}
                      alt={`${match.user.name}'s avatar`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-500">{match.user.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {Math.round(match.matchScore * 100)}% Match
                    </span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-1">
                    <Link to={`/profile/${match.user._id}`} className="text-primary-600 hover:text-primary-700">
                      {match.user.name}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-2">{match.user.title}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {match.user.profileType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {match.user.experience}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {match.user.location}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {match.user.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {skill}
                        </span>
                      ))}
                      {match.user.skills.length > 5 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{match.user.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {match.job && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Matched for job:</h3>
                      <Link to={`/jobs/${match.job._id}`} className="text-primary-600 hover:text-primary-700">
                        {match.job.title} at {match.job.company}
                      </Link>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link to={`/matches/${match._id}`}>
                      <Button variant="primary" size="sm">View Details</Button>
                    </Link>
                    {match.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* TODO: Handle accept */}}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {/* TODO: Handle reject */}}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {match.status === 'accepted' && (
                      <Link to={`/messages/${match.user._id}`}>
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 self-start">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    match.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches; 