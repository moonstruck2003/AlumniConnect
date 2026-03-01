import { useState } from 'react';
import { Search, Filter, MapPin, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Mentorship.css';

const mentorsData = [
  {
    id: 1,
    name: 'David Chen',
    role: 'Senior Staff Engineer',
    company: 'Google',
    location: 'San Francisco, CA',
    expertise: ['System Architecture', 'Career Growth', 'React'],
    available: true,
  },
  {

    id: 2,
    name: 'Sarah Jenkins',
    role: 'Product Design Lead',
    company: 'Spotify',
    location: 'Remote',
    expertise: ['UI/UX', 'Portfolio Review', 'Figma'],
    available: true,
  },
  {
    id: 3,
    name: 'Michael Torres',
    role: 'Marketing Director',
    company: 'Nike',
    location: 'Portland, OR',
    expertise: ['Brand Strategy', 'Leadership', 'Networking'],
    available: false,
  }
];

export default function Mentorship() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="mentorship-page-container">
      <Navbar activeItem="Mentorship" />
      <div className="page-header">
        <h1 className="page-title">Mentorship Program</h1>
        <p className="page-subtitle">Find a mentor or offer your guidance to fellow alumni</p>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, role, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> Filters
        </button>
      </div>

      <p className="results-text">Showing {mentorsData.length} of {mentorsData.length} mentors</p>

      <div className="mentors-grid">
        {mentorsData.map((mentor) => (
          <div key={mentor.id} className="mentor-card">
            <div className="card-header">
              <div className="mentor-icon-wrapper">
                <span className="mentor-initials">{mentor.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <span className={`status-badge ${mentor.available ? 'available' : 'unavailable'}`}>
                {mentor.available ? 'Accepting Mentees' : 'At Capacity'}
              </span>
            </div>

            <h3 className="mentor-name">{mentor.name}</h3>
            <p className="mentor-role">{mentor.role} @ {mentor.company}</p>

            <div className="mentor-details">
              <div className="detail-row">
                <MapPin size={16} className="detail-icon" />
                <span>{mentor.location}</span>
              </div>
              <div className="expertise-container">
                <Award size={16} className="detail-icon" />
                <div className="skills-list">
                  {mentor.expertise.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="action-btn"
              disabled={!mentor.available}
              style={{ opacity: mentor.available ? 1 : 0.5, cursor: mentor.available ? 'pointer' : 'not-allowed' }}
            >
              Request Mentorship
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}