import { useEffect, useState } from 'react';
import { User, Building2, Linkedin, FileText, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import './RecruiterProfile.css';
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
}

export default function RecruiterProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ApiClient();
      const data = await api.getProfile();
      console.log('Profile API Response:', data); // Debug log

      if (data && data.user) {
        setProfile(data.user);
      } else if (data && data.id) {
        setProfile(data); // If not wrapped in { user: ... }
      } else {
        throw new Error('Failed to parse profile data format');
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
          <h1 className="profile-name">{profile.name}</h1>
          <span className="profile-role-badge">{profile.role}</span>
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
                <span className={`info-value ${!profile.recruiter_company ? 'empty' : ''}`}>
                  {profile.recruiter_company || 'Not provided'}
                </span>
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
            </div>
            <div className="info-item full-width">
              <span className="info-label">Bio</span>
              <span className={`info-value ${!profile.short_bio ? 'empty' : ''}`}>
                {profile.short_bio || 'No bio added yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
