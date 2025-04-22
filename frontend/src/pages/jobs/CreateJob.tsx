import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'co-founder', label: 'Co-founder' }
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-9 years)' },
  { value: 'expert', label: 'Expert (10+ years)' }
];

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' }
];

function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    skills: '',
    location: '',
    remote: true,
    jobType: 'full-time',
    expLevel: 'mid',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Format skills as an array and prepare payload
      const payload = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        location: formData.location,
        remote: formData.remote,
        jobType: formData.jobType,
        expLevel: formData.expLevel,
        salary: {
          min: parseInt(formData.salaryMin, 10) || 0,
          max: parseInt(formData.salaryMax, 10) || 0,
          currency: formData.currency
        }
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Job posted successfully!');
      navigate(`/jobs/${response.data._id}`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
          Cancel
        </Link>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer, UI/UX Designer"
              required
            />
          </div>
          
          <div>
            <Input
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Inc."
              required
            />
          </div>
          
          <div>
            <TextArea
              label="Job Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the role, responsibilities, and qualifications"
              rows={6}
              required
            />
          </div>
          
          <div>
            <Input
              label="Skills Required (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, TypeScript, UI Design"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-8">
              <input
                type="checkbox"
                id="remote"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="block text-sm font-medium text-gray-700">
                This job is remote-friendly
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Job Type"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                options={jobTypes}
                required
              />
            </div>
            
            <div>
              <Select
                label="Experience Level"
                name="expLevel"
                value={formData.expLevel}
                onChange={handleChange}
                options={experienceLevels}
                required
              />
            </div>
          </div>
          
          <div>
            <h3 className="block text-sm font-medium text-gray-700 mb-2">Salary Range (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Minimum"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 50000"
                />
              </div>
              
              <div>
                <Input
                  label="Maximum"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  type="number"
                  placeholder="e.g. 80000"
                />
              </div>
              
              <div>
                <Select
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={currencies}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              loading={loading}
              fullWidth
            >
              Post Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateJob; 