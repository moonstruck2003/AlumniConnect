import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from '../components/Navbar';
import './AlumniDirectory.css';
import { useState } from 'react';

const MOCK_ALUMNI = [
    { id: 1, firstName: 'Sarah', lastName: 'Johnson', role: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', classYear: '2018', isMentor: true, industry: 'Technology' },
    { id: 2, firstName: 'Michael', lastName: 'Chen', role: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', classYear: '2015', isMentor: true, industry: 'Technology' },
    { id: 3, firstName: 'Emily', lastName: 'Rodriguez', role: 'Marketing Director', company: 'Coca-Cola', location: 'Atlanta, GA', classYear: '2019', isMentor: false, industry: 'Marketing' },
    { id: 4, firstName: 'David', lastName: 'Kim', role: 'Investment Banker', company: 'Goldman Sachs', location: 'New York, NY', classYear: '2020', isMentor: true, industry: 'Finance' },
    { id: 5, firstName: 'Jessica', lastName: 'Wang', role: 'ML Engineer', company: 'Meta', location: 'Menlo Park, CA', classYear: '2021', isMentor: true, industry: 'Technology' },
    { id: 6, firstName: 'Robert', lastName: 'Taylor', role: 'Medical Resident', company: 'General Hospital', location: 'Austin, TX', classYear: '2016', isMentor: false, industry: 'Healthcare' },
];

export default function AlumniDirectory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mentorsOnly, setMentorsOnly] = useState(false);
    const [industryFilter, setIndustryFilter] = useState('All Industries');
    const [showFilters, setShowFilters] = useState(false);

    const filteredAlumni = MOCK_ALUMNI.filter(alumni => {
        const fullName = `${alumni.firstName} ${alumni.lastName}`.toLowerCase();
        const searchMatch = fullName.includes(searchQuery.toLowerCase()) ||
            alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.role.toLowerCase().includes(searchQuery.toLowerCase());

        const mentorMatch = mentorsOnly ? alumni.isMentor : true;
        const industryMatch = industryFilter === 'All Industries' ? true : alumni.industry === industryFilter;

        return searchMatch && mentorMatch && industryMatch;
    });

    return (
        <div className="alumni-page">
            <div className="alumni-container">
                <Navbar activeItem="Alumni Directory" />

                <div className="alumni-header">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="page-title">Alumni Directory</h1>
                        <p className="page-subtitle">Connect with {MOCK_ALUMNI.length} alumni from our university</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="filters-card"
                >
                    <div className="search-bar-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, company, or role..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className={`btn-filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} /> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="filter-options"
                        >
                            <select
                                className="industry-select"
                                value={industryFilter}
                                onChange={(e) => setIndustryFilter(e.target.value)}
                            >
                                <option>All Industries</option>
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Marketing</option>
                                <option>Healthcare</option>
                            </select>

                            <label className="mentor-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    checked={mentorsOnly}
                                    onChange={(e) => setMentorsOnly(e.target.checked)}
                                />
                                <span>Mentors Only</span>
                            </label>
                        </motion.div>
                    )}
                </motion.div>

                <div className="results-info">
                    Showing {filteredAlumni.length} of {MOCK_ALUMNI.length} alumni
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="alumni-grid"
                >
                    {filteredAlumni.map((alumni) => (
                        <motion.div
                            key={alumni.id}
                            whileHover={{ y: -5 }}
                            className="alumni-card"
                        >
                            <div className="card-header">
                                <div className="avatar-initials">
                                    {alumni.firstName[0]}{alumni.lastName[0]}
                                </div>
                                {alumni.isMentor && (
                                    <span className="mentor-badge">Mentor</span>
                                )}
                            </div>

                            <h3 className="alumni-name">{alumni.firstName} {alumni.lastName}</h3>
                            <p className="alumni-role">{alumni.role}</p>

                            <div className="alumni-details">
                                <div className="detail-item">
                                    <Briefcase size={14} />
                                    <span>{alumni.company}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={14} />
                                    <span>{alumni.location}</span>
                                </div>
                                <div className="detail-item">
                                    <GraduationCap size={14} />
                                    <span>Class of {alumni.classYear}</span>
                                </div>
                            </div>

                            <button className="btn-view-profile">
                                View Profile
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
}
