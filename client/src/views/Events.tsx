import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Clock } from 'lucide-react';
import './Events.css';

// Dummy data for events
const eventsData = [
  {
    id: 1,
    title: 'Tech Alumni Mixer 2026',
    type: 'In-Person',
    date: 'March 15, 2026',
    time: '6:00 PM - 9:00 PM',
    location: 'Downtown Tech Hub, Seattle',
    description: 'Join us for an evening of networking with fellow alumni in the tech industry. Drinks and appetizers provided.',
  },
  {
    id: 2,
    title: 'Resume Building Workshop',
    type: 'Virtual',
    date: 'March 22, 2026',
    time: '2:00 PM - 3:30 PM',
    location: 'Zoom (Link provided upon RSVP)',
    description: 'Learn how to optimize your resume for ATS and stand out to recruiters in today\'s competitive market.',
  },
  {
    id: 3,
    title: 'Startup Founders Panel',
    type: 'Hybrid',
    date: 'April 5, 2026',
    time: '5:30 PM - 7:00 PM',
    location: 'University Main Auditorium & Online',
    description: 'Hear from three successful alumni founders about their journey from dorm room to Series A funding.',
  }
];

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="events-page-container">
      {/* Headers */}
      <div className="page-header">
        <h1 className="page-title">Upcoming Events</h1>
        <p className="page-subtitle">Network, learn, and connect at our upcoming gatherings</p>
      </div>

      {/* search  er section*/}
      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search events by name, location, or type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> Filters
        </button>
      </div>

      <p className="results-text">Showing {eventsData.length} of {eventsData.length} events</p>

      {/* Events Grid */}
      <div className="events-grid">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card">
            <div className="card-header">
              <div className="event-icon-wrapper">
                <Calendar size={24} color="#10b981" />
              </div>
              <span className="event-badge">{event.type}</span>
            </div>
            
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="detail-row">
                <Calendar size={16} className="detail-icon" />
                <span>{event.date}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} className="detail-icon" />
                <span>{event.time}</span>
              </div>
              <div className="detail-row">
                <MapPin size={16} className="detail-icon" />
                <span>{event.location}</span>
              </div>
            </div>

            <button className="rsvp-btn">RSVP Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}