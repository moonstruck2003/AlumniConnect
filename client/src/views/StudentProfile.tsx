import { useEffect, useState } from 'react';
import { User, Briefcase, Linkedin, FileText, Loader, GraduationCap, Edit2, Save, X, CheckCircle, ShieldX } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import './AlumniProfile.css'; // Reusing the same beautiful dark theme CSS
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
  is_verified: boolean;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [mentorshipRequests, setMentorshipRequests] = useState<any[]>([]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ApiClient();
      const data = await api.getProfile();

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
        throw new Error('Failed to load profile');
      }

      // Fetch mentorship requests
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

  useEffect(() => {
    fetchProfile();
  }, []);

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
        toast.success('Student profile updated successfully!');
      } else if (data && data.id) {
        setProfile(data);
        setIsEditing(false);
        toast.success('Student profile updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to update student profile');
    }
  };

  if (loading) {
    return (
      <div className="profile-page-container">
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
        <div className="profile-error">
          <span>{error || 'Could not load student profile'}</span>
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
                  <span className="verified-text">  Verified</span>
                </div>
              ) : (
                <div className="unverified-badge-main" title="Verification Pending">
                  <ShieldX size={20} className="text-slate-500" />
                  <span className="unverified-text">Unverified</span>
                </div>
              )}
            </div>
          )}
          <span className="profile-role-badge">Student</span>

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
              <span className="info-value">{profile.email}</span>
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
                <input className="edit-input" name="department" value={formData.department || ''} onChange={handleInputChange} placeholder="e.g. Computer Science" />
              ) : (
                <span className={`info-value ${!profile.department ? 'empty' : ''}`}>{profile.department || 'Not provided'}</span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Student ID</span>
              {isEditing ? (
                <input className="edit-input" name="student_id" value={formData.student_id || ''} onChange={handleInputChange} placeholder="e.g. 1910001" />
              ) : (
                <span className={`info-value ${!profile.student_id ? 'empty' : ''}`}>{profile.student_id || 'Not provided'}</span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Current CGPA</span>
              {isEditing ? (
                <input className="edit-input" name="cgpa" type="number" step="0.01" value={formData.cgpa || ''} onChange={handleInputChange} placeholder="e.g. 3.8" />
              ) : (
                <span className={`info-value ${!profile.cgpa ? 'empty' : ''}`}>{profile.cgpa || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Details (Internships) */}
        <div className="profile-card">
          <h3 className="card-title">
            <Briefcase size={20} /> Internships / Experience
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Role Title</span>
              {isEditing ? (
                <input className="edit-input" name="job_title" value={formData.job_title || ''} onChange={handleInputChange} placeholder="e.g. Software Engineering Intern" />
              ) : (
                <span className={`info-value ${!profile.job_title ? 'empty' : ''}`}>{profile.job_title || 'Not provided'}</span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Company</span>
              {isEditing ? (
                <input className="edit-input" name="company" value={formData.company || ''} onChange={handleInputChange} placeholder="e.g. Tech Corp" />
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
                <input className="edit-input" name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/username" />
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
              <span className="info-label">About Me</span>
              {isEditing ? (
                <textarea className="edit-textarea" name="short_bio" value={formData.short_bio || ''} onChange={handleInputChange} placeholder="Tell us about your interests, projects, and goals..." rows={4} />
              ) : (
                <span className={`info-value ${!profile.short_bio ? 'empty' : ''}`}>
                  {profile.short_bio || 'No bio added yet'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mentorship Requests Section */}
        <div className="profile-card">
          <h3 className="card-title">
            <User size={20} /> My Mentorship Requests
          </h3>
          <div className="mentorship-list-mini">
            {mentorshipRequests.length === 0 ? (
              <p className="empty-msg">No mentorship requests sent yet.</p>
            ) : (
              <div className="mini-requests-grid">
                {mentorshipRequests.map((req) => (
                  <div key={req.id} className="mini-req-item">
                    <div className="mini-req-info">
                      <span className="mentor-name-small">{req.mentor?.name}</span>
                      <span className="req-date-small">{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className={`status-tag-small ${req.status}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
