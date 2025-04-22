import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface ProfileData {
  _id: string;
  name: string;
  title: string;
  bio: string;
  profileType: string;
  skills: string[];
  experience: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  createdAt: string;
}

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = id ? `/users/${id}` : '/users/me';
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProfile(response.data);
        
        // If no ID was provided, this is the current user's profile
        if (!id) {
          setIsCurrentUser(true);
        } else {
          // Check if the viewed profile is the current user's
          const currentUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsCurrentUser(currentUserResponse.data._id === response.data._id);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto text-center py-8">
          <h2 className="text-xl text-red-600 mb-4">{error}</h2>
          <Link to="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto text-center py-8">
          <h2 className="text-xl mb-4">Profile not found</h2>
          <Link to="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const experienceLabelMap: Record<string, string> = {
    entry: 'Entry Level (0-2 years)',
    mid: 'Mid Level (3-5 years)',
    senior: 'Senior (6-9 years)',
    expert: 'Expert (10+ years)'
  };

  const profileTypeLabelMap: Record<string, string> = {
    founder: 'Founder',
    engineer: 'Engineer',
    designer: 'Designer',
    product: 'Product Manager',
    marketing: 'Marketing',
    sales: 'Sales',
    other: 'Other'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {isCurrentUser && (
          <div className="flex justify-end mb-4">
            <Link to="/profile-setup">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        )}
        
        <Card className="mb-6">
          <div className="flex items-start md:items-center flex-col md:flex-row">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name}'s avatar`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">{profile.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{profile.title}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {profileTypeLabelMap[profile.profileType] || profile.profileType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {experienceLabelMap[profile.experience] || profile.experience}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {profile.location}
                </span>
              </div>
              
              <div className="flex gap-3 mt-3">
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                )}
                
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="whitespace-pre-line">{profile.bio}</p>
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile; 