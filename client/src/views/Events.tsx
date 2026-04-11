import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, Clock, Plus, X, Star, ArrowRight, Users, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import './Events.css';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  image?: string;
  featured: boolean;
}

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Propose Modal State
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', startTime: '', endTime: '', location: '', category: 'Networking' });
  
  // Details Modal State
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const navigate = useNavigate();
  const api = new ApiClient();

  const handlePropose = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let formattedDate = newEvent.date;
      if (newEvent.date.includes('-')) {
        const dateObj = new Date(newEvent.date);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        formattedDate = `${monthNames[dateObj.getUTCMonth()]} ${String(dateObj.getUTCDate()).padStart(2, '0')}`;
      }

      const formatTime = (time24: string) => {
        if (!time24) return '';
        let [hoursStr, minutes] = time24.split(':');
        let hours = parseInt(hoursStr, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      };

      const formattedTime = `${formatTime(newEvent.startTime)} - ${formatTime(newEvent.endTime)}`;

      const payload = { 
        title: newEvent.title,
        location: newEvent.location,
        category: newEvent.category,
        date: formattedDate,
        time: formattedTime 
      };

      const response = await api.createEvent(payload);
      setEvents([response, ...events]);
      setShowModal(false);
      setNewEvent({ title: '', date: '', startTime: '', endTime: '', location: '', category: 'Networking' });
    } catch (error) {
      console.error('Error proposing event:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        // Ensure we always have an array
        const eventsData = Array.isArray(response) ? response : (response?.data && Array.isArray(response.data) ? response.data : []);
        setEvents(eventsData);
        await api.markNotificationsTypeRead('event').catch(() => {});
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Networking', 'Career', 'Workshop', 'Webinar'];

  const monthMap: { [key: string]: number } = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };

  const filteredEvents = (Array.isArray(events) ? events : [])
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const getVal = (dateStr: string) => {
        const parts = dateStr.split(' ');
        if (parts.length < 2) return 0;
        const month = monthMap[parts[0].toUpperCase()] ?? 0;
        const day = parseInt(parts[1], 10);
        return month * 100 + day; // Simple comparable value for month/day
      };
      return getVal(a.date) - getVal(b.date);
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  return (
    <div className="events-main-wrapper">
      <Navbar activeItem="Events" />
      
      <div className="events-page-header">
        <div className="header-text-group">
          <h1 className="header-title">Events & Gatherings</h1>
          <p className="header-subtitle">Join workshops and mixers hosted by your alumni network</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="functional-propose-btn" 
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Propose Event
        </motion.button>
      </div>

      <section className="events-filter-section">
        <div className="search-input-pill">
          <Search size={18} className="search-icon-muted" />
          <input
            type="text"
            placeholder="Search events or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-scroll-pill">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="events-content-area">
        {loading ? (
          <div className="loading-grid-polished">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-item-polished" />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state-functional">
            <Calendar size={40} strokeWidth={1.5} />
            <p>No upcoming events found</p>
            <button onClick={() => setShowModal(true)} className="btn-link-emerald">Propose the first one</button>
          </div>
        ) : (
          <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="staggered-events-grid"
          >
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="functional-event-card"
                >
                  <div className="card-media-section">
                    <img 
                      src={event.image || "https://images.unsplash.com/photo-1540575861501-7ce05b40a190?auto=format&fit=crop&q=80&w=800"} 
                      alt=""
                    />
                    <div className="card-top-badges">
                      <div className="compact-date-badge">
                        <span className="compact-month">{event.date.split(' ')[0]}</span>
                        <span className="compact-day">{event.date.split(' ')[1]}</span>
                      </div>
                      {event.featured && (
                        <div className="compact-featured-tag">
                          <Star size={10} fill="currentColor" /> Featured
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-body-section">
                    <span className="card-category-indicator">{event.category}</span>
                    <h3 className="card-event-name">{event.title}</h3>
                    
                    <div className="card-meta-info">
                      <div className="meta-row">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="meta-row">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    
                    <button className="card-action-btn" onClick={() => handleViewDetails(event)}>
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Propose Event Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="functional-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="functional-modal-content"
            >
              <div className="modal-header-simple">
                <h2>Propose Event</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <form onSubmit={handlePropose} className="modal-form-simple">
                <div className="field-group">
                  <label>Title</label>
                  <input required type="text" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Name" />
                </div>
                
                <div className="field-row">
                  <div className="field-group">
                    <label>Date</label>
                    <input required type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>Category</label>
                    <select value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}>
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label>Start</label>
                    <input required type="time" value={newEvent.startTime} onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>End</label>
                    <input required type="time" value={newEvent.endTime} onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})} />
                  </div>
                </div>

                <div className="field-group">
                  <label>Location</label>
                  <input required type="text" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location" />
                </div>

                <div className="modal-actions-simple">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit">Submit Proposal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedEvent && (
          <div className="functional-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="functional-modal-content details-modal"
            >
              <div className="details-header-image">
                <img src={selectedEvent.image || "https://images.unsplash.com/photo-1540575861501-7ce05b40a190?auto=format&fit=crop&q=80&w=800"} alt="" />
                <button className="details-close-btn" onClick={() => setShowDetailsModal(false)}><X size={20} /></button>
              </div>
              
              <div className="details-body">
                <div className="details-meta-top">
                  <span className="details-category">{selectedEvent.category}</span>
                  {selectedEvent.featured && <span className="details-featured"><Star size={10} fill="currentColor" /> Featured Premier</span>}
                </div>
                
                <h2 className="details-title">{selectedEvent.title}</h2>
                
                <div className="details-info-grid">
                  <div className="details-info-item">
                    <div className="info-item-icon"><Calendar size={18} /></div>
                    <div className="info-item-text">
                      <label>Date</label>
                      <span>{selectedEvent.date}</span>
                    </div>
                  </div>
                  <div className="details-info-item">
                    <div className="info-item-icon"><Clock size={18} /></div>
                    <div className="info-item-text">
                      <label>Time</label>
                      <span>{selectedEvent.time}</span>
                    </div>
                  </div>
                  <div className="details-info-item">
                    <div className="info-item-icon"><MapPin size={18} /></div>
                    <div className="info-item-text">
                      <label>Location</label>
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="details-description">
                  <h3>About this Event</h3>
                  <p>
                    Experience an exclusive {selectedEvent.category.toLowerCase()} gathering at {selectedEvent.location}. 
                    Connect with fellow alumni, share insights, and expand your professional network in this uniquely 
                    curated session.
                  </p>
                </div>

                <div className="details-actions">
                  <button className="confirm-close-btn" onClick={() => setShowDetailsModal(false)}>Close Details</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}