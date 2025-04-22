import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface JobDetails {
  _id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  remote: boolean;
  jobType: string;
  expLevel: string;
  createdBy: {
    _id: string;
    name: string;
    title?: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setJob(response.data);
        
        // Check if current user is the job creator
        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setIsOwner(userResponse.data._id === response.data.createdBy._id);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    setApplyLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${id}/apply`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Job deleted successfully!');
      navigate('/my-jobs');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Failed to delete job. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-xl text-red-600 mb-4">{error || 'Job not found'}</h2>
          <Link to="/jobs">
            <Button variant="primary">Browse All Jobs</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/jobs" className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Jobs
            </Link>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{job.company} • {job.location} {job.remote ? '(Remote)' : ''}</p>
          </div>
          
          {isOwner ? (
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to={`/jobs/edit/${job._id}`}>
                <Button variant="outline">Edit Job</Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          ) : (
            <Button 
              onClick={handleApply} 
              loading={applyLoading}
            >
              Apply Now
            </Button>
          )}
        </div>
        
        <Card className="mb-6">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {job.jobType}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {job.expLevel}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {job.remote ? 'Remote' : 'On-site'}
            </span>
            {job.salary && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <div className="whitespace-pre-line">{job.description}</div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">About the Poster</h2>
            <div className="flex items-center">
              {job.createdBy.avatarUrl ? (
                <img
                  src={job.createdBy.avatarUrl}
                  alt={`${job.createdBy.name}'s avatar`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-xl text-gray-500">{job.createdBy.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <Link to={`/profile/${job.createdBy._id}`} className="font-medium text-primary-600 hover:text-primary-700">
                  {job.createdBy.name}
                </Link>
                {job.createdBy.title && (
                  <p className="text-gray-600">{job.createdBy.title}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-gray-500 text-sm">
          Posted on {formatDate(job.createdAt)}
          {job.updatedAt !== job.createdAt && ` • Updated on ${formatDate(job.updatedAt)}`}
        </div>
        
        {!isOwner && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleApply} 
              loading={applyLoading}
              size="lg"
            >
              Apply for this Position
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetails; 