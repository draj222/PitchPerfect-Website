import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';

const profileTypes = [
  { value: 'founder', label: 'Founder' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'designer', label: 'Designer' },
  { value: 'product', label: 'Product Manager' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'other', label: 'Other' }
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-9 years)' },
  { value: 'expert', label: 'Expert (10+ years)' }
];

function ProfileSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileType: 'founder',
    skills: '',
    experience: 'mid',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    avatarUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Format skills as an array
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      
      await axios.post(`${import.meta.env.VITE_API_URL}/users/profile`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Set Up Your Profile</h1>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                label="Professional Title"
                name="title"
                value={formData.title}
                placeholder="e.g. Software Engineer, Startup Founder"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <TextArea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself, your background, and what you're looking for"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Profile Type"
                name="profileType"
                value={formData.profileType}
                onChange={handleChange}
                options={profileTypes}
                required
              />
            </div>
            <div>
              <Select
                label="Experience Level"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                options={experienceLevels}
                required
              />
            </div>
          </div>
          
          <div>
            <Input
              label="Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Product Management"
              required
            />
          </div>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                type="url"
              />
            </div>
            <div>
              <Input
                label="GitHub URL"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                type="url"
              />
            </div>
          </div>
          
          <div>
            <Input
              label="Portfolio URL"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleChange}
              type="url"
            />
          </div>
          
          <div>
            <Input
              label="Avatar URL"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              type="url"
              placeholder="Link to your profile picture"
            />
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfileSetup; 