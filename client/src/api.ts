import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

const getToken = () => localStorage.getItem('jwt_token');

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = secrets.backendEndpoint || 'http://localhost:8000';
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // currently, only fetches 1 session greater than current time
  async getSession() {
    try {
      const response = await this.client.get('/api/session');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createSession(name: string, duration: number, username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }
      const response = await this.client.post('/api/session', { name, duration, username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSession(session_id: number, active: boolean, username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }

      const response = await this.client.put('/api/session', { session_id, active, username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async submitAttendance(roll: number) {
    try {
      const response = await this.client.post('/api/attendance', { roll });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async viewSessions(username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }
      const response = await this.client.post('/api/sessions', { username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProfile() {
    try {
      const response = await this.client.get('/api/user');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUserProfile(id: number | string) {
    try {
      const response = await this.client.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProfile(profileData: any) {
    try {
      const response = await this.client.put('/api/user', profileData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Job Postings API
  async getJobs(type?: string) {
    try {
      const url = type ? `/api/jobs?type=${type}` : '/api/jobs';
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createJob(jobData: { title: string, company: string, type: string, location?: string, description: string, contact_email?: string, contact_phone?: string, application_link?: string }) {
    try {
      const response = await this.client.post('/api/jobs', jobData);
      toast.success(response.data.message || 'Job posted successfully');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMyJobs() {
    try {
      const response = await this.client.get('/api/jobs/me');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async toggleJobStatus(id: number) {
    try {
      const response = await this.client.patch(`/api/jobs/${id}/toggle-status`);
      toast.success(response.data.message || 'Status updated');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async applyToJob(jobId: number, formData: FormData) {
    try {
      const response = await this.client.post(`/api/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message || 'Application submitted');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getJobApplicants(jobId: number) {
    try {
      const response = await this.client.get(`/api/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateApplicationStatus(applicationId: number, status: string) {
    try {
      const response = await this.client.patch(`/api/applications/${applicationId}/status`, { status });
      toast.success(response.data.message || 'Status updated');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMyApplications() {
    try {
      const response = await this.client.get('/api/applications/me');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getNotifications(page = 1) {
    try {
      const response = await this.client.get(`/api/notifications?page=${page}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getUnreadNotificationCount() {
    try {
      const response = await this.client.get('/api/notifications/unread-count');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getNotificationCountsByType() {
    try {
      const response = await this.client.get('/api/notifications/unread-counts-by-type');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async markNotificationsTypeRead(type: string) {
    try {
      const response = await this.client.patch(`/api/notifications/type/${type}/read`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async markNotificationRead(id: number) {
    try {
      const response = await this.client.patch(`/api/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async markAllNotificationsRead() {
    try {
      const response = await this.client.post('/api/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Event API
  async getEvents() {
    try {
      const response = await this.client.get('/api/events');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createEvent(eventData: { title: string, date: string, time: string, location: string, category: string, image?: string }) {
    try {
      const response = await this.client.post('/api/events', eventData);
      toast.success('Event proposed successfully');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getMentors() {
    try {
      const response = await this.client.get('/api/mentorship/mentors');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAlumni() {
    try {
      const response = await this.client.get('/api/alumni');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async requestMentorship(mentor_id: number, message: string) {
    try {
      const response = await this.client.post('/api/mentorship/requests', { mentor_id, message });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getMentorshipRequests() {
    try {
      const response = await this.client.get('/api/mentorship/requests');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateMentorshipRequestStatus(id: number, status: string) {
    try {
      const response = await this.client.put(`/api/mentorship/requests/${id}`, { status });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Handle common errors
  async getConversations() {
    try {
      const response = await this.client.get('/api/messages/conversations');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getConversation(userId: number) {
    try {
      const response = await this.client.get(`/api/messages/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async sendMessage(receiver_id: number, content: string) {
    try {
      const response = await this.client.post('/api/messages', { receiver_id, content });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  getStorageUrl(path: string) {
    const baseURL = secrets.backendEndpoint || 'http://localhost:8000';
    return `${baseURL}/storage/${path}`;
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.post('/api/forgot-password', { email });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async chatWithAi(message: string) {
    try {
      const response = await this.client.post('/api/ai/chat', { message });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async resetPassword(data: any) {
    try {
      const response = await this.client.post('/api/reset-password', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(`API Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
      // Request was made, but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something went wrong while setting up the request
      console.error('API Error:', error.message);
    }

    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(errorMessage);
  }
}

export default ApiClient;
