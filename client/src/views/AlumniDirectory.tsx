import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, GraduationCap, Users, Globe, Building2, CheckCircle } from 'lucide-react';
import './AlumniDirectory.css';
import { useState, useEffect } from 'react';
import ApiClient from '../api';

const api = new ApiClient();

export default function AlumniDirectory() {
    const [alumniList, setAlumniList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [mentorsOnly, setMentorsOnly] = useState(false);
    const [industryFilter, setIndustryFilter] = useState('All Industries');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [gradYearFilter, setGradYearFilter] = useState('All Years');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const data = await api.getAlumni();
            if (data && data.alumni) {
                setAlumniList(data.alumni);
            }
        } catch (error) {
            console.error('Error fetching alumni:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlumni = alumniList.filter(alumni => {
        const fullName = (alumni.name || '').toLowerCase();
        const searchMatch = fullName.includes(searchQuery.toLowerCase()) ||
            (alumni.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (alumni.job_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (alumni.skills || []).some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const mentorMatch = mentorsOnly ? alumni.is_accepting_mentees : true;
        const industryMatch = industryFilter === 'All Industries' ? true : alumni.industry === industryFilter;
        const departmentMatch = departmentFilter === 'All Departments' ? true : alumni.department === departmentFilter;
        const gradYearMatch = gradYearFilter === 'All Years' ? true : alumni.graduation_year === gradYearFilter;

        return searchMatch && mentorMatch && industryMatch && departmentMatch && gradYearMatch;
    });

    // Stats for Insights
    const topCompanies = [...new Set(alumniList.map(a => a.company).filter(Boolean))].slice(0, 4);
    const totalMentors = alumniList.filter(a => a.is_accepting_mentees).length;
    const globalReach = [...new Set(alumniList.map(a => a.location).filter(Boolean).map(loc => loc.split(', ').pop()))].length;

    return (
        <div className="alumni-page" style={{ paddingTop: '0' }}>
            <div className="alumni-container" style={{ paddingTop: '0' }}>
                <div className="alumni-header">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="page-title">Alumni Directory</h1>
                        <p className="page-subtitle">Connect with {alumniList.length} global professionals from our network</p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading alumni directory...</p>
                    </div>
                ) : (
                    <>
                        {/* Network Insights Section */}
                        <div className="network-insights">
                            <motion.div 
                                className="insight-card"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="insight-icon companies-icon"><Building2 size={24} /></div>
                                <div className="insight-content">
                                    <h4>Top Companies</h4>
                                    <p>{topCompanies.slice(0, 3).join(', ')} & more</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="insight-card"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="insight-icon mentors-icon"><Users size={24} /></div>
                                <div className="insight-content">
                                    <h4>Expert Mentors</h4>
                                    <p>{totalMentors} Active alumni ready to guide</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="insight-card"
                                whileHover={{ scale: 1.02 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="insight-icon global-icon"><Globe size={24} /></div>
                                <div className="insight-content">
                                    <h4>Global Network</h4>
                                    <p>Connecting across {globalReach} regions</p>
                                </div>
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
                                        className="filter-select"
                                        value={industryFilter}
                                        onChange={(e) => setIndustryFilter(e.target.value)}
                                    >
                                        <option>All Industries</option>
                                        <option>Technology</option>
                                        <option>Finance</option>
                                        <option>Marketing</option>
                                        <option>Healthcare</option>
                                    </select>

                                    <select
                                        className="filter-select"
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                    >
                                        <option>All Departments</option>
                                        <option>Computer Science</option>
                                        <option>Software Engineering</option>
                                        <option>Business Administration</option>
                                        <option>Economics</option>
                                        <option>Data Science</option>
                                        <option>Mathematics</option>
                                        <option>Medicine</option>
                                    </select>

                                    <select
                                        className="filter-select"
                                        value={gradYearFilter}
                                        onChange={(e) => setGradYearFilter(e.target.value)}
                                    >
                                        <option>All Years</option>
                                        <option>2022</option>
                                        <option>2021</option>
                                        <option>2020</option>
                                        <option>2019</option>
                                        <option>2018</option>
                                        <option>2017</option>
                                        <option>2016</option>
                                        <option>2015</option>
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
                            Showing {filteredAlumni.length} of {alumniList.length} alumni
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
                                            {(alumni.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        {alumni.is_accepting_mentees && (
                                            <span className="mentor-badge">Mentor</span>
                                        )}
                                    </div>

                            <div className="flex items-center gap-2 justify-center">
                                <h3 className="alumni-name">{alumni.name}</h3>
                                {alumni.is_verified && (
                                    <div className="verified-badge" title="Verified Alumni">
                                        <CheckCircle size={14} fill="#10b981" color="white" />
                                    </div>
                                )}
                            </div>
                            <p className="alumni-role">{alumni.job_title || 'Alumni'}</p>

                                    <div className="alumni-details">
                                        <div className="detail-item">
                                            <Briefcase size={14} />
                                            <span>{alumni.company || 'Private'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <MapPin size={14} />
                                            <span>{alumni.location || 'Location Hidden'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <GraduationCap size={14} />
                                            <span>Class of {alumni.graduation_year || 'N/A'} ({alumni.department})</span>
                                        </div>
                                    </div>

                                    <div className="skills-tags">
                                        {(alumni.skills || []).map((skill: string, idx: number) => (
                                            <span key={idx} className="skill-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="btn-view-profile" onClick={() => window.location.href = `/profile/${alumni.id}`}>
                                        View Profile
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
