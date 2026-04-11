import { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Award, Loader, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Mentorship.css';

export default function Mentorship() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('find');
  const [mentors, setMentors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [requestType, setRequestType] = useState('sent'); // 'sent' or 'received'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [message, setMessage] = useState('');

  const fetchMentorsAndRequests = async () => {
    setLoading(true);
    try {
      const api = new ApiClient();
      const [mentorsData, requestsData] = await Promise.all([
        api.getMentors(),
        api.getMentorshipRequests()
      ]);

      if (mentorsData && mentorsData.mentors) {
        setMentors(mentorsData.mentors);
      }
      if (requestsData) {
        setRequests(requestsData.requests || []);
        setRequestType(requestsData.type || 'sent');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsAndRequests();
    // Clear mentorship notifications when page is opened
    const api = new ApiClient();
    api.markNotificationsTypeRead('mentorship').catch(err => console.error(err));
  }, []);

  const openRequestModal = (mentor: any) => {
    setSelectedMentor(mentor);
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSendRequest = async () => {
    if (!selectedMentor) return;
    try {
      const api = new ApiClient();
      const response = await api.requestMentorship(selectedMentor.id, message);
      if (response && response.message) {
        toast.success(response.message);
        setIsModalOpen(false);
        fetchMentorsAndRequests();
      }
    } catch (err: any) {
       // ApiClient already shows toast error for 400 bad request
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const api = new ApiClient();
      const response = await api.updateMentorshipRequestStatus(id, status);
      if (response) {
        toast.success(`Request ${status}`);
        fetchMentorsAndRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // filter
  const filteredMentors = mentors.filter(m => 
    (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (m.company && m.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.job_title && m.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mentorship-page-container">
      <Navbar activeItem="Mentorship" />
      <div className="page-header">
        <h1 className="page-title">Mentorship Program</h1>
        <p className="page-subtitle">Find a mentor or review your mentorship requests</p>
      </div>

      <div className="mentorship-tabs">
        <button 
          className={`tab-btn ${activeTab === 'find' ? 'active' : ''}`}
          onClick={() => setActiveTab('find')}
        >
          Find Mentors
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          My Requests {requests.length > 0 && `(${requests.length})`}
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Loader size={32} className="spinner" />
          <p>Loading mentorship data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'find' && (
            <>
              <div className="search-filter-container">
                <div className="search-box">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name, role, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="filter-btn">
                  <Filter size={18} /> Filters
                </button>
              </div>

              <p className="results-text">Showing {filteredMentors.length} of {mentors.length} mentors</p>

              <div className="mentors-grid">
                {filteredMentors.map((mentor) => (
                  <div key={mentor.id} className="mentor-card">
                    <div className="card-header">
                      <div className="mentor-icon-wrapper">
                        <span className="mentor-initials">
                          {mentor.name ? mentor.name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className={`status-badge ${mentor.is_accepting_mentees ? 'available' : 'unavailable'}`}>
                        {mentor.is_accepting_mentees ? 'Accepting Mentees' : 'At Capacity'}
                      </span>
                    </div>

                    <h3 className="mentor-name">{mentor.name || 'Unknown Alumni'}</h3>
                    <p className="mentor-role">{mentor.job_title || 'Alumni'} {mentor.company && `@ ${mentor.company}`}</p>

                    <div className="mentor-details">
                      <div className="detail-row">
                        <MapPin size={16} className="detail-icon" />
                        <span>{mentor.location || 'Remote'}</span>
                      </div>
                      <div className="expertise-container">
                        <Award size={16} className="detail-icon" />
                        <div className="skills-list">
                          {mentor.department && <span className="skill-tag">{mentor.department}</span>}
                          <span className="skill-tag">Guidance</span>
                        </div>
                      </div>
                    </div>

                    {user?.id !== mentor.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        {user?.role === 'student' ? (
                          <>
                            {requests.some(req => req.mentor_id === mentor.id && req.status !== 'rejected') ? (
                              <button 
                                className="action-btn" 
                                disabled
                                style={{ 
                                  flex: 1, 
                                  opacity: 0.6, 
                                  cursor: 'not-allowed', 
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#94a3b8'
                                }}
                              >
                                applied
                              </button>
                            ) : (
                              <button 
                                className="action-btn" 
                                onClick={() => openRequestModal(mentor)}
                                disabled={!mentor.is_accepting_mentees}
                                style={{ flex: 1, opacity: mentor.is_accepting_mentees ? 1 : 0.5, cursor: mentor.is_accepting_mentees ? 'pointer' : 'not-allowed' }}
                              >
                                {mentor.is_accepting_mentees ? 'Request Mentorship' : 'Unavailable'}
                              </button>
                            )}
                          </>
                        ) : (
                          <button 
                            className="action-btn" 
                            disabled 
                            title="Only students can request mentorship"
                            style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}
                          >
                            Students Only
                          </button>
                        )}
                        <button 
                          onClick={() => navigate('/messages', { state: { selectedUser: mentor } })}
                          title="Send Message"
                          style={{ 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem',
                            background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--card-border)', 
                            borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                          }}
                          onMouseOver={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-emerald)'; e.currentTarget.style.color = 'var(--accent-emerald)';}}
                          onMouseOut={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'white';}}
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    ) : (
                       <button className="action-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed', marginTop: '1rem' }}>
                        This is You
                      </button>
                    )}
                  </div>
                ))}
                {filteredMentors.length === 0 && (
                  <p>No mentors found matching your criteria.</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'requests' && (
            <div className="requests-container">
              {requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#1a202c', borderRadius: '1rem', border: '1px solid #374151' }}>
                  <h3>No Mentorship Requests</h3>
                  <p style={{ color: '#9ca3af' }}>You have not {requestType === 'received' ? 'received' : 'sent'} any requests yet.</p>
                </div>
              ) : (
                requests.map(req => {
                  const otherPerson = requestType === 'received' ? req.mentee : req.mentor;
                  return (
                    <div key={req.id} className="request-card">
                      <div className="request-info">
                        <h4>{otherPerson?.name || 'Unknown User'}</h4>
                        <p>{requestType === 'received' ? 'Received from mentee on' : 'Sent to mentor on'} {new Date(req.created_at).toLocaleDateString()}</p>
                        {req.message && <div className="req-msg">"{req.message}"</div>}
                      </div>

                      <div className="req-actions">
                        {requestType === 'received' && req.status === 'pending' ? (
                          <>
                            <button className="btn-accept" onClick={() => handleUpdateStatus(req.id, 'accepted')}>Accept</button>
                            <button className="btn-reject" onClick={() => handleUpdateStatus(req.id, 'rejected')}>Reject</button>
                          </>
                        ) : (
                           <span className={`req-status ${req.status}`}>
                             {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                           </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* Request Modal */}
      {isModalOpen && selectedMentor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request Mentorship from {selectedMentor.name}</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Add a short message introducing yourself and what you're hoping to learn.</p>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm checking out your profile and looking for guidance in..."
            />
            <div className="modal-actions">
              <button className="modal-btn btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="modal-btn btn-submit" onClick={handleSendRequest}>Send Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}