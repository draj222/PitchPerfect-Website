import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  jobType: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/created`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load your jobs. Please try again later.');
        toast.error('Failed to load your jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setJobs(jobs.filter(job => job._id !== id));
      toast.success('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Failed to delete job');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Job Listings</h1>
        <Link to="/jobs/create">
          <Button variant="primary">Create New Job</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {jobs.length === 0 && !error ? (
        <Card className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600 mb-4">You haven't posted any jobs yet</h2>
          <p className="text-gray-500 mb-6">
            Create your first job listing to find talented individuals for your startup!
          </p>
          <Link to="/jobs/create">
            <Button variant="primary">Post a Job</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applicants</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Posted</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                    <Link to={`/jobs/${job._id}`} className="font-medium text-primary-600 hover:text-primary-700">
                      {job.title}
                    </Link>
                    <div className="text-gray-500 mt-1">{job.company}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {job.location} {job.remote && "(Remote)"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link to={`/jobs/${job._id}/applicants`} className="text-primary-600 hover:text-primary-700">
                      {job.applicantsCount || 0} applicants
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex gap-2">
                      <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                      <Link to={`/jobs/edit/${job._id}`} className="text-green-600 hover:text-green-900">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyJobs; 