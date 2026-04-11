import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { User, Briefcase, Linkedin, FileText, Loader, GraduationCap, Edit2, Save, X, CheckCircle, ShieldX } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import './AlumniProfile.css';
import toast from 'react-hot-toast';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  linkedin_url: string | null;
  short_bio: string | null;
  company: string | null;
  job_title: string | null;
  department: string | null;
  student_id: string | null;
  cgpa: string | null;
  is_accepting_mentees: boolean;
  is_verified: boolean;
}

export default function AlumniProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [mentorshipRequests, setMentorshipRequests] = useState<any[]>([]);

  const isOwnProfile = !id || id === currentUser?.id?.toString();

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ApiClient();
      let data;
      
      if (isOwnProfile) {
        data = await api.getProfile();
      } else {
        data = await api.getUserProfile(id!);
      }

      console.log('Profile API Response:', data);

      if (data && data.user) {
        setProfile(data.user);
        setFormData(data.user);
      } else if (data && data.id) {
        setProfile(data);
        setFormData(data);
      } else if (data && data.data) {
        setProfile(data.data);
        setFormData(data.data);
      } else {
        console.error('Invalid profile data format:', data);
        throw new Error('Failed to load profile - Invalid format');
      }

      // Fetch received mentorship requests
      const requestsData = await api.getMentorshipRequests();
      if (requestsData && requestsData.requests) {
        setMentorshipRequests(requestsData.requests);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const api = new ApiClient();
      const response = await api.updateMentorshipRequestStatus(id, status);
      if (response) {
        toast.success(`Request ${status}`);
        // Refresh local state
        setMentorshipRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const api = new ApiClient();
      const data = await api.updateProfile(formData);
      if (data && data.user) {
        setProfile(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else if (data && data.id) {
        setProfile(data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update profile');
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
            {isOwnProfile && (
              isEditing ? (
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
              )
            )}
            {!isOwnProfile && (
                <button className="btn-edit" onClick={() => window.location.href = `/messages`}>
                    Message
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
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>
                {profile.role}
              </span>
            </div>
            <div className="info-item full-width" style={{ marginTop: '0.5rem' }}>
              <span className="info-label">Mentorship Status</span>
              {isEditing ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
                  <input
                    type="checkbox"
                    name="is_accepting_mentees"
                    checked={!!formData.is_accepting_mentees}
                    onChange={(e) => setFormData({ ...formData, is_accepting_mentees: e.target.checked })}
                    style={{ width: '1.2rem', height: '1.2rem', accentColor: '#10b981' }}
                  />
                  <span>{formData.is_accepting_mentees ? 'Yes, accepting requests' : 'No, currently at capacity'}</span>
                </label>
              ) : (
                <span className={`status-badge ${profile.is_accepting_mentees ? 'available' : 'unavailable'}`} style={{ display: 'inline-block', width: 'fit-content', marginTop: '0.25rem' }}>
                  {profile.is_accepting_mentees ? 'Accepting Mentees' : 'At Capacity'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="profile-card">
          <h3 className="card-title">
            <GraduationCap size={20} /> Academic Details
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Department</span>
              {isEditing ? (
                  <input className="edit-input" name="department" value={formData.department || ''} onChange={handleInputChange} placeholder="e.g. Computer Science"/>
              ) : (
                  <span className={`info-value ${!profile.department ? 'empty' : ''}`}>{profile.department || 'Not provided'}</span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Student ID</span>
              {isEditing ? (
                  <input className="edit-input" name="student_id" value={formData.student_id || ''} onChange={handleInputChange} placeholder="e.g. 1910001"/>
              ) : (
                  <span className={`info-value ${!profile.student_id ? 'empty' : ''}`}>{profile.student_id || 'Not provided'}</span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">CGPA</span>
              {isEditing ? (
                  <input className="edit-input" name="cgpa" type="number" step="0.01" value={formData.cgpa || ''} onChange={handleInputChange} placeholder="e.g. 3.8"/>
              ) : (
                  <span className={`info-value ${!profile.cgpa ? 'empty' : ''}`}>{profile.cgpa || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="profile-card">
            <h3 className="card-title">
              <Briefcase size={20} /> Professional Details
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Job Title</span>
                  {isEditing ? (
                      <input className="edit-input" name="job_title" value={formData.job_title || ''} onChange={handleInputChange} placeholder="e.g. Software Engineer"/>
                  ) : (
                      <span className={`info-value ${!profile.job_title ? 'empty' : ''}`}>{profile.job_title || 'Not provided'}</span>
                  )}
              </div>
              <div className="info-item">
                <span className="info-label">Company</span>
                  {isEditing ? (
                      <input className="edit-input" name="company" value={formData.company || ''} onChange={handleInputChange} placeholder="e.g. Google"/>
                  ) : (
                      <span className={`info-value ${!profile.company ? 'empty' : ''}`}>{profile.company || 'Not provided'}</span>
                  )}
              </div>
            </div>
        </div>

        {/* Additional Info */}
        <div className="profile-card">
          <h3 className="card-title">
            <FileText size={20} /> Additional Details
          </h3>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">LinkedIn URL</span>
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
                  <textarea className="edit-textarea" name="short_bio" value={formData.short_bio || ''} onChange={handleInputChange} placeholder="Tell us about yourself..." rows={4}/>
              ) : (
                  <span className={`info-value ${!profile.short_bio ? 'empty' : ''}`}>
                    {profile.short_bio || 'No bio added yet'}
                  </span>
              )}
            </div>
          </div>
        </div>

        {/* Mentorship Management Section (Only visible to owner) */}
        {isOwnProfile && (
          <div className="profile-card">
            <h3 className="card-title">
              <User size={20} /> Received Mentorship Requests
            </h3>
            <div className="mentorship-list-mini">
              {mentorshipRequests.length === 0 ? (
                <p className="empty-msg">No pending requests received.</p>
              ) : (
                <div className="mini-requests-grid">
                  {mentorshipRequests.map((req) => (
                    <div key={req.id} className="mini-req-item received">
                      <div className="mini-req-info">
                        <span className="mentee-name-small">{req.mentee?.name}</span>
                        <p className="req-msg-preview">"{req.message || 'No message provided'}"</p>
                        <span className="req-date-small">{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mini-req-actions">
                        {req.status === 'pending' ? (
                          <>
                            <button className="mini-btn-accept" onClick={() => handleStatusUpdate(req.id, 'accepted')}>Accept</button>
                            <button className="mini-btn-reject" onClick={() => handleStatusUpdate(req.id, 'rejected')}>Reject</button>
                          </>
                        ) : (
                          <span className={`status-tag-small ${req.status}`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
