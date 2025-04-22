import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';

interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  location: string;
  remote: boolean;
  jobType: string;
  expLevel: string;
  createdBy: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

function JobsExplore() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTermLower) ||
      job.company.toLowerCase().includes(searchTermLower) ||
      job.description.toLowerCase().includes(searchTermLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Explore Jobs</h1>
        <div className="flex gap-4">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Link to="/jobs/create">
            <Button variant="primary">Post a Job</Button>
          </Link>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <Card className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 mb-4">No jobs found</h2>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to post a job opportunity!'}
          </p>
          <Link to="/jobs/create">
            <Button variant="primary">Post a Job</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map(job => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-1">
                    <Link to={`/jobs/${job._id}`} className="text-primary-600 hover:text-primary-700">
                      {job.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 mb-2">{job.company} • {job.location} {job.remote ? '(Remote)' : ''}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.expLevel}
                    </span>
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">Posted by {job.createdBy.name} on {formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <Link to={`/jobs/${job._id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsExplore; 