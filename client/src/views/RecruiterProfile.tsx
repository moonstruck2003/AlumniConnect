import { useEffect, useState } from 'react';
import { User, Building2, Linkedin, FileText, Loader, Briefcase, CheckCircle, XCircle, Edit2, Save, X, ShieldX } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import './RecruiterProfile.css';
import toast from 'react-hot-toast';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  recruiter_company: string | null;
  linkedin_url: string | null;
  short_bio: string | null;
  company: string | null;
  job_title: string | null;
  is_verified: boolean;
}

export default function RecruiterProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ApiClient();
      const data = await api.getProfile();
      console.log('Profile API Response:', data); // Debug log

      if (data && data.user) {
        setProfile(data.user);
        setFormData(data.user);
      } else if (data && data.id) {
        setProfile(data); // If not wrapped in { user: ... }
        setFormData(data);
      } else {
        throw new Error('Failed to parse profile data format');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const api = new ApiClient();
      const data = await api.getMyJobs();
      if (data && data.success) {
        setMyJobs(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching jobs', err);
    }
  };

  const handleToggleJob = async (jobId: number) => {
    try {
      const api = new ApiClient();
      const data = await api.toggleJobStatus(jobId);
      if (data && data.success) {
        setMyJobs(myJobs.map(job => job.id === jobId ? { ...job, is_active: data.is_active } : job));
      }
    } catch (error) {
      console.error('Failed to toggle job', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const api = new ApiClient();
      // the api endpoint accepts recruiter_company, linkedin, etc.
      // mapped internally to user table
      const data = await api.updateProfile(formData);
      if (data && data.user) {
        setProfile(data.user);
        setIsEditing(false);
        toast.success('Recruiter profile updated successfully!');
      } else if (data && data.id) {
        setProfile(data);
        setIsEditing(false);
        toast.success('Recruiter profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update recruiter profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-page-container">
        <Navbar activeItem="Profile" />
        <div className="profile-loading">
          <Loader size={32} className="spinner" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page-container">
        <Navbar activeItem="Profile" />
        <div className="profile-error">
          <span>{error || 'Could not load profile'}</span>
          <button className="retry-btn" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page-container">
      <Navbar activeItem="Profile" />

      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          
          {isEditing ? (
            <input 
              className="edit-input name-edit" 
              name="name" 
              value={formData.name || ''} 
              onChange={handleInputChange} 
            />
          ) : (
            <div className="flex items-center gap-2">
                <h1 className="profile-name">{profile.name}</h1>
                {profile.is_verified ? (
                    <div className="verified-badge-main" title="Verified Account">
                        <CheckCircle size={20} fill="#10b981" color="white" />
                        <span className="verified-text">Verified</span>
                    </div>
                ) : (
                    <div className="unverified-badge-main" title="Verification Pending">
                        <ShieldX size={20} className="text-slate-500" />
                        <span className="unverified-text">Unverified</span>
                    </div>
                )}
            </div>
          )}
          
          <span className="profile-role-badge">{profile.role}</span>
          
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn-save" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
                <button className="btn-cancel" onClick={() => { setIsEditing(false); setFormData(profile); }}>
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="profile-card">
          <h3 className="card-title">
            <User size={20} /> Account Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{profile.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* Company Info (Recruiter specific) */}
        {profile.role === 'recruiter' && (
          <div className="profile-card">
            <h3 className="card-title">
              <Building2 size={20} /> Company Details
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Company Name</span>
                {isEditing ? (
                  <input className="edit-input" name="recruiter_company" value={formData.recruiter_company || ''} onChange={handleInputChange} placeholder="e.g. Acme Corp"/>
                ) : (
                  <span className={`info-value ${!profile.recruiter_company ? 'empty' : ''}`}>
                    {profile.recruiter_company || 'Not provided'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="profile-card">
          <h3 className="card-title">
            <FileText size={20} /> Additional Details
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">LinkedIn</span>
              {isEditing ? (
                  <input className="edit-input" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/username"/>
              ) : (
                  <span className={`info-value ${!profile.linkedin_url ? 'empty' : ''}`}>
                    {profile.linkedin_url ? (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={14} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        {profile.linkedin_url}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </span>
              )}
            </div>
            <div className="info-item full-width">
              <span className="info-label">Bio</span>
              {isEditing ? (
                  <textarea className="edit-textarea" name="short_bio" value={formData.short_bio || ''} onChange={handleInputChange} placeholder="Tell candidates about yourself..." rows={4}/>
              ) : (
                  <span className={`info-value ${!profile.short_bio ? 'empty' : ''}`}>
                    {profile.short_bio || 'No bio added yet'}
                  </span>
              )}
            </div>
          </div>
        </div>

        {/* My Job Postings Management - Recruiter Only */}
        {profile.role === 'recruiter' && (
          <div className="profile-card">
            <h3 className="card-title">
              <Briefcase size={20} /> My Job Posts
            </h3>
            {myJobs.length === 0 ? (
              <p className="empty-jobs-text">You haven't posted any jobs or internships yet.</p>
            ) : (
              <div className="managed-jobs-list">
                {myJobs.map((job) => (
                  <div key={job.id} className={`managed-job-item ${!job.is_active ? 'inactive' : ''}`}>
                    <div className="job-info">
                      <h4>{job.title}</h4>
                      <span className="job-meta">{job.type} • {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="job-actions">
                      <button 
                        className={`status-toggle ${job.is_active ? 'active' : 'inactive'}`} 
                        onClick={() => handleToggleJob(job.id)}
                      >
                        {job.is_active ? (
                          <><CheckCircle size={16} /> Active</>
                        ) : (
                          <><XCircle size={16} /> Hidden</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
