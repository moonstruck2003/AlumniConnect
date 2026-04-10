import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, GraduationCap, Users, Globe, Building2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import './AlumniDirectory.css';
import { useState } from 'react';

const MOCK_ALUMNI = [
    { id: 1, firstName: 'Sarah', lastName: 'Johnson', role: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', classYear: '2018', isMentor: true, industry: 'Technology', department: 'Computer Science', skills: ['React', 'Node.js', 'System Design'] },
    { id: 2, firstName: 'Michael', lastName: 'Chen', role: 'Product Manager', company: 'Microsoft', location: 'Seattle, WA', classYear: '2015', isMentor: true, industry: 'Technology', department: 'Software Engineering', skills: ['Agile', 'Product Strategy', 'UI/UX'] },
    { id: 3, firstName: 'Emily', lastName: 'Rodriguez', role: 'Marketing Director', company: 'Coca-Cola', location: 'Atlanta, GA', classYear: '2019', isMentor: false, industry: 'Marketing', department: 'Business Administration', skills: ['Brand Management', 'Digital Marketing'] },
    { id: 4, firstName: 'David', lastName: 'Kim', role: 'Investment Banker', company: 'Goldman Sachs', location: 'New York, NY', classYear: '2020', isMentor: true, industry: 'Finance', department: 'Economics', skills: ['Financial Modeling', 'Valuation'] },
    { id: 5, firstName: 'Jessica', lastName: 'Wang', role: 'ML Engineer', company: 'Meta', location: 'Menlo Park, CA', classYear: '2021', isMentor: true, industry: 'Technology', department: 'Data Science', skills: ['Python', 'PyTorch', 'Computer Vision'] },
    { id: 6, firstName: 'Robert', lastName: 'Taylor', role: 'Medical Resident', company: 'General Hospital', location: 'Austin, TX', classYear: '2016', isMentor: false, industry: 'Healthcare', department: 'Medicine', skills: ['Diagnostics', 'Patient Care'] },
    { id: 7, firstName: 'Aisha', lastName: 'Khan', role: 'UX Designer', company: 'Adobe', location: 'San Francisco, CA', classYear: '2017', isMentor: true, industry: 'Technology', department: 'Computer Science', skills: ['Figma', 'User Research', 'Prototyping'] },
    { id: 8, firstName: 'James', lastName: 'Wilson', role: 'Data Analyst', company: 'Google', location: 'London, UK', classYear: '2022', isMentor: false, industry: 'Technology', department: 'Mathematics', skills: ['SQL', 'Tableau', 'Statistics'] },
];

export default function AlumniDirectory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mentorsOnly, setMentorsOnly] = useState(false);
    const [industryFilter, setIndustryFilter] = useState('All Industries');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [gradYearFilter, setGradYearFilter] = useState('All Years');
    const [showFilters, setShowFilters] = useState(false);

    const filteredAlumni = MOCK_ALUMNI.filter(alumni => {
        const fullName = `${alumni.firstName} ${alumni.lastName}`.toLowerCase();
        const searchMatch = fullName.includes(searchQuery.toLowerCase()) ||
            alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumni.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const mentorMatch = mentorsOnly ? alumni.isMentor : true;
        const industryMatch = industryFilter === 'All Industries' ? true : alumni.industry === industryFilter;
        const departmentMatch = departmentFilter === 'All Departments' ? true : alumni.department === departmentFilter;
        const gradYearMatch = gradYearFilter === 'All Years' ? true : alumni.classYear === gradYearFilter;

        return searchMatch && mentorMatch && industryMatch && departmentMatch && gradYearMatch;
    });

    // Stats for Insights
    const topCompanies = ['Google', 'Microsoft', 'Meta', 'Adobe'];
    const totalMentors = MOCK_ALUMNI.filter(a => a.isMentor).length;
    const globalReach = [...new Set(MOCK_ALUMNI.map(a => a.location.split(', ').pop()))].length;

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
                        <p className="page-subtitle">Connect with {MOCK_ALUMNI.length} global professionals from our network</p>
                    </motion.div>
                </div>

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
                                        <span>Class of {alumni.classYear} ({alumni.department})</span>
                                    </div>
                                </div>

                                <div className="skills-tags">
                                    {alumni.skills.map((skill, idx) => (
                                        <span key={idx} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
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
