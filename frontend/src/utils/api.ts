import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Flag to enable mock mode (frontend only) - setting to true to work without backend
const MOCK_MODE = true;

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

// Mock data for frontend-only mode
const mockUsers = [
  {
    id: '1',
    name: 'Demo Founder',
    email: 'founder@example.com',
    password: 'password',
    role: 'founder',
    profileCompleted: true
  },
  {
    id: '2',
    name: 'Demo Engineer',
    email: 'engineer@example.com',
    password: 'password',
    role: 'engineer',
    profileCompleted: true
  }
];

// Mock handlers for frontend-only mode
const mockHandlers = {
  // Auth endpoints
  'POST /auth/login': (data: any): ApiResponse<any> => {
    const { email, password } = data;
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // In demo mode, any password works
    const token = 'mock-jwt-token-' + user.id;
    localStorage.setItem('token', token);
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    };
  },
  
  'POST /auth/register': (data: any): ApiResponse<any> => {
    const { name, email, password, role = 'engineer' } = data;
    
    if (mockUsers.some(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role,
      profileCompleted: false
    };
    
    mockUsers.push(newUser);
    const token = 'mock-jwt-token-' + newUser.id;
    localStorage.setItem('token', token);
    
    return {
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      }
    };
  },
  
  'GET /auth/me': (): ApiResponse<any> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userId = token.split('-').pop();
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    };
  },

  // Jobs endpoints
  'GET /jobs': (): ApiResponse<any> => {
    return {
      success: true,
      data: [
        {
          _id: '1',
          title: 'Senior React Developer',
          company: 'TechCorp',
          description: 'We are looking for an experienced React developer to join our team.',
          skills: ['React', 'TypeScript', 'Node.js'],
          location: 'San Francisco, CA',
          remote: true,
          jobType: 'Full-time',
          expLevel: 'Senior',
          createdBy: {
            _id: '1',
            name: 'Demo Founder',
            avatarUrl: ''
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Product Manager',
          company: 'StartupInc',
          description: 'Looking for a product manager to help us launch our new product.',
          skills: ['Product Management', 'Agile', 'UX'],
          location: 'New York, NY',
          remote: false,
          jobType: 'Full-time',
          expLevel: 'Mid-level',
          createdBy: {
            _id: '1',
            name: 'Demo Founder',
            avatarUrl: ''
          },
          createdAt: new Date().toISOString()
        }
      ]
    };
  },

  'GET /jobs/:id': (data: any, params: any): ApiResponse<any> => {
    const jobId = params?.id || '1';
    return {
      success: true,
      data: {
        _id: jobId,
        title: jobId === '1' ? 'Senior React Developer' : 'Product Manager',
        company: jobId === '1' ? 'TechCorp' : 'StartupInc',
        description: 'Detailed job description would go here. This is a mock response for demo purposes.',
        skills: jobId === '1' ? ['React', 'TypeScript', 'Node.js'] : ['Product Management', 'Agile', 'UX'],
        location: jobId === '1' ? 'San Francisco, CA' : 'New York, NY',
        remote: jobId === '1',
        jobType: 'Full-time',
        expLevel: jobId === '1' ? 'Senior' : 'Mid-level',
        createdBy: {
          _id: '1',
          name: 'Demo Founder',
          avatarUrl: ''
        },
        createdAt: new Date().toISOString()
      }
    };
  },

  // User stats for dashboard
  'GET /users/stats': (): ApiResponse<any> => {
    return {
      success: true,
      data: {
        profileCompleted: true,
        matchesAsCandidate: 5,
        jobsPosted: 2,
        matchesForJobs: 8,
        messagesSent: 12,
        messagesReceived: 15,
        unreadMessages: 3,
        pendingMatches: 2,
        acceptedMatches: 3,
        totalMatches: 5
      }
    };
  },

  // Messages endpoints
  'GET /messages': (): ApiResponse<any> => {
    return {
      success: true,
      data: [
        {
          _id: '1',
          participants: [
            { _id: '2', name: 'Demo Engineer', avatarUrl: '' },
            { _id: '1', name: 'Demo Founder', avatarUrl: '' }
          ],
          lastMessage: {
            text: 'I would love to discuss the position further.',
            sender: '2',
            createdAt: new Date().toISOString()
          },
          unreadCount: 1,
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          participants: [
            { _id: '3', name: 'Jane Smith', avatarUrl: '' },
            { _id: '1', name: 'Demo Founder', avatarUrl: '' }
          ],
          lastMessage: {
            text: 'When can we schedule a call?',
            sender: '3',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          unreadCount: 2,
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
  }
};

// Generic get request
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    // In mock mode, check for mock handler
    if (MOCK_MODE) {
      const mockHandler = mockHandlers[`GET ${url}`];
      if (mockHandler) {
        console.log(`[MOCK] GET ${url}`);
        return mockHandler();
      }
      console.log(`[MOCK] No handler for GET ${url}, falling back to real API`);
    }
    
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return { success: false, error: 'Network error' };
  }
};

// Generic post request
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    // In mock mode, check for mock handler
    if (MOCK_MODE) {
      const mockHandler = mockHandlers[`POST ${url}`];
      if (mockHandler) {
        console.log(`[MOCK] POST ${url}`, data);
        return mockHandler(data);
      }
      console.log(`[MOCK] No handler for POST ${url}, falling back to real API`);
    }
    
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return { success: false, error: 'Network error' };
  }
};

// Generic put request
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    // In mock mode, check for mock handler
    if (MOCK_MODE) {
      const mockHandler = mockHandlers[`PUT ${url}`];
      if (mockHandler) {
        console.log(`[MOCK] PUT ${url}`, data);
        return mockHandler(data);
      }
      console.log(`[MOCK] No handler for PUT ${url}, falling back to real API`);
    }
    
    const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return { success: false, error: 'Network error' };
  }
};

// Generic delete request
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    // In mock mode, check for mock handler
    if (MOCK_MODE) {
      const mockHandler = mockHandlers[`DELETE ${url}`];
      if (mockHandler) {
        console.log(`[MOCK] DELETE ${url}`);
        return mockHandler();
      }
      console.log(`[MOCK] No handler for DELETE ${url}, falling back to real API`);
    }
    
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<T>;
    }
    return { success: false, error: 'Network error' };
  }
};

export default api; 