import { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, Clock, Plus, Mail, Phone, ExternalLink, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../api';
import './Jobs.css';

interface Job {
  id: number;
  user_id: number;
  title: string;
  company: string;
  type: string;
  location: string | null;
  description: string;
  contact_email: string | null;
  contact_phone: string | null;
  application_link: string | null;
  created_at: string;
  user?: { name: string; email: string };
}

export default function Jobs() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: (user?.recruiter_company || user?.company || '') as string,
    type: 'job',
    location: '',
    description: '',
    contact_email: (user?.email || '') as string,
    contact_phone: '',
    application_link: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const api = new ApiClient();
      const typeParam = filterType === 'all' ? undefined : filterType;
      const data = await api.getJobs(typeParam);
      if (data && data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Failed to load jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filterType]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const api = new ApiClient();
      const data = await api.createJob(formData);
      if (data && data.success) {
        setIsModalOpen(false);
        setFormData({ ...formData, title: '', description: '', location: '', application_link: '' });
        fetchJobs(); // refresh list
      }
    } catch (error) {
      console.error('Failed to create job', error);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div className="jobs-page-container">
      <Navbar activeItem="Jobs & Internships" />
      <div className="page-header">
        <h1 className="page-title">Jobs & Internships</h1>
        <p className="page-subtitle">Discover career opportunities from our alumni network</p>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="filter-select custom-select" 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="job">Jobs</option>
          <option value="internship">Internships</option>
        </select>

        {user?.role === 'recruiter' && (
          <button className="post-job-btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Post Job
          </button>
        )}
      </div>

      <p className="results-text">
        {loading ? 'Loading opportunities...' : `Showing ${filteredJobs.length} opportunities`}
      </p>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">No jobs found matching your criteria.</div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="card-header">
              <div className="job-icon-wrapper">
                <Briefcase size={24} color="#10b981" />
              </div>
              <span className="job-badge">{job.type}</span>
            </div>

            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>

            <div className="job-details">
              {job.location && (
                <div className="detail-row">
                  <MapPin size={16} className="detail-icon" />
                  <span>{job.location}</span>
                </div>
              )}
              {job.contact_email && (
                <div className="detail-row">
                  <Mail size={16} className="detail-icon" />
                  <span><a href={`mailto:${job.contact_email}`}>{job.contact_email}</a></span>
                </div>
              )}
              {job.contact_phone && (
                <div className="detail-row">
                  <Phone size={16} className="detail-icon" />
                  <span>{job.contact_phone}</span>
                </div>
              )}
              <div className="detail-row">
                <Clock size={16} className="detail-icon" />
                <span>Posted {formatDate(job.created_at)}</span>
              </div>
            </div>

            <div className="job-description">
              <p>{job.description}</p>
            </div>

            {job.application_link ? (
              <a href={job.application_link.startsWith('http') ? job.application_link : `https://${job.application_link}`} target="_blank" rel="noopener noreferrer" className="apply-btn text-center" style={{display: 'block', textDecoration: 'none'}}>
                Apply via External Link <ExternalLink size={14} style={{display: 'inline', marginLeft: '4px'}}/>
              </a>
            ) : job.contact_email ? (
              <a href={`mailto:${job.contact_email}?subject=Application for ${job.title} at ${job.company}`} className="apply-btn text-center" style={{display: 'block', textDecoration: 'none'}}>
                Apply via Email
              </a>
            ) : (
              <button className="apply-btn disabled" disabled>No contact info provided</button>
            )}
          </div>
        ))}
      </div>
      )}

      {/* Post Job Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Post a New Opportunity</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateJob} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Software Engineer" />
                </div>
                <div className="form-group">
                  <label>Company *</label>
                  <input required type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, or City, NY" />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..."></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Email</label>
                  <input type="email" value={formData.contact_email} onChange={(e) => setFormData({...formData, contact_email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input type="tel" value={formData.contact_phone} onChange={(e) => setFormData({...formData, contact_phone: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Application Link (Optional)</label>
                <input type="url" value={formData.application_link} onChange={(e) => setFormData({...formData, application_link: e.target.value})} placeholder="https://company.com/careers/apply" />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn btn-primary">Post Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}