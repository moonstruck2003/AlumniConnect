import { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, Clock, Plus, Mail, Phone, ExternalLink, X, FileText, Download, CheckCircle, XCircle, MessageCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface Application {
  id: number;
  user_id: number;
  job_posting_id: number;
  resume_path: string;
  cover_letter: string | null;
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted';
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    department: string | null;
    graduation_year: string | null;
  };
}

export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState<{[key: number]: string}>({}); // Map of jobID -> status

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

  // Application Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applyData, setApplyData] = useState({
    resume: null as File | null,
    cover_letter: ''
  });
  const [applying, setApplying] = useState(false);

  // Applicants Modal State
  const [applicantsModalOpen, setApplicantsModalOpen] = useState(false);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [viewingJobTitle, setViewingJobTitle] = useState('');

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

  const fetchMyApplications = async () => {
    if (!user) return;
    try {
      const api = new ApiClient();
      const data = await api.getMyApplications();
      if (data && data.success) {
        const statusMap: {[key: number]: string} = {};
        data.data.forEach((app: any) => {
          statusMap[app.job_posting_id] = app.status;
        });
        setMyApplications(statusMap);
      }
    } catch (error) {
      console.error('Failed to fetch my applications', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, [filterType, user]);

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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId || !applyData.resume) return;

    setApplying(true);
    try {
      const api = new ApiClient();
      const fd = new FormData();
      fd.append('resume', applyData.resume);
      fd.append('cover_letter', applyData.cover_letter);

      const data = await api.applyToJob(selectedJobId, fd);
      if (data && data.success) {
        setApplyModalOpen(false);
        setApplyData({ resume: null, cover_letter: '' });
        fetchMyApplications(); // Refresh applied status
      }
    } catch (error) {
      console.error('Application failed', error);
    } finally {
      setApplying(false);
    }
  };

  const fetchApplicants = async (jobId: number, jobTitle: string) => {
    setViewingJobTitle(jobTitle);
    setApplicantsModalOpen(true);
    setLoadingApplicants(true);
    try {
      const api = new ApiClient();
      const data = await api.getJobApplicants(jobId);
      if (data && data.success) {
        setApplicants(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch applicants', error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (appId: number, status: string) => {
    try {
      const api = new ApiClient();
      const data = await api.updateApplicationStatus(appId, status);
      if (data && data.success) {
        // Update local state
        setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: status as any } : a));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    } catch (e) {
      return 'N/A';
    }
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

            <div className="job-actions">
              {user?.role === 'recruiter' && Number(job.user_id) === Number(user?.id) ? (
                <button 
                  className="view-applicants-btn btn-secondary w-full"
                  onClick={() => fetchApplicants(job.id, job.title)}
                >
                  View Applicants
                </button>
              ) : job.application_link ? (
                <a href={job.application_link.startsWith('http') ? job.application_link : `https://${job.application_link}`} target="_blank" rel="noopener noreferrer" className="apply-btn text-center" style={{display: 'block', textDecoration: 'none'}}>
                  Apply via External Link <ExternalLink size={14} style={{display: 'inline', marginLeft: '4px'}}/>
                </a>
              ) : myApplications[job.id] ? (
                <div className="status-container w-full">
                   <div className={`status-banner ${myApplications[job.id]}`}>
                      {myApplications[job.id] === 'accepted' ? '🎉 Hired' : 
                       myApplications[job.id].charAt(0).toUpperCase() + myApplications[job.id].slice(1)}
                   </div>
                   <button className="apply-btn w-full applied-btn" disabled>
                     Already Applied
                   </button>
                </div>
              ) : (
                <button 
                  className="apply-btn w-full"
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setApplyModalOpen(true);
                  }}
                >
                  Apply Now
                </button>
              )}
            </div>
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

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Submit Application</h2>
              <button className="close-btn" onClick={() => setApplyModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleApply} className="job-form">
              <div className="form-group">
                <label>Resume (PDF only, max 2MB) *</label>
                <div className="file-upload-wrapper">
                   <input 
                    required 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setApplyData({ ...applyData, resume: e.target.files?.[0] || null })}
                   />
                </div>
              </div>

              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea 
                  rows={6} 
                  value={applyData.cover_letter} 
                  onChange={(e) => setApplyData({ ...applyData, cover_letter: e.target.value })} 
                  placeholder="Tell the recruiter why you are a great fit..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setApplyModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit-btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {applicantsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content wide-modal">
            <div className="modal-header">
              <h2>Applicants for: {viewingJobTitle}</h2>
              <button className="close-btn" onClick={() => setApplicantsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="applicants-list">
              {loadingApplicants ? (
                <div className="loading-state">Loading applicants...</div>
              ) : applicants.length === 0 ? (
                <div className="empty-state">No applications received yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="applicants-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Documents</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="applicant-info">
                              <span className="applicant-name">{app.user?.name || 'Unknown Candidate'}</span>
                              <span className="applicant-email">{app.user?.email || 'N/A'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="doc-links">
                              <a 
                                href={new ApiClient().getStorageUrl(app.resume_path)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resume-link"
                              >
                                <Download size={16} /> Resume
                              </a>
                              {app.cover_letter && (
                                <button className="view-link" onClick={() => alert(app.cover_letter)}>
                                  <FileText size={16} /> Cover
                                </button>
                              )}
                            </div>
                          </td>
                          <td>{formatDate(app.created_at)}</td>
                          <td>
                            <span className={`status-badge ${app.status}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button 
                              className="action-icon message" 
                              title="Message Candidate" 
                              onClick={() => navigate('/messages', { 
                                state: { 
                                  selectedUser: { 
                                    id: app.user?.id, 
                                    name: app.user?.name, 
                                    job_title: 'Applicant',
                                    company: viewingJobTitle 
                                  } 
                                } 
                              })}
                            >
                              <MessageCircle size={18} />
                            </button>
                            <button className="action-icon check" title="Shortlist" onClick={() => handleUpdateStatus(app.id, 'shortlisted')}>
                              <CheckCircle size={18} />
                            </button>
                            <button className="action-icon hire" title="Hire/Accept" onClick={() => handleUpdateStatus(app.id, 'accepted')}>
                              <Award size={18} />
                            </button>
                            <button className="action-icon cross" title="Reject" onClick={() => handleUpdateStatus(app.id, 'rejected')}>
                              <XCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}