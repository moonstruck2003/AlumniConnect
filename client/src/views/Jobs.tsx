import { useState } from 'react';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Jobs.css';

const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechFlow Solutions',
    type: 'Full-time',
    location: 'Remote',
    salary: '$90k - $120k',
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Data Science Intern',
    company: 'Quantum Analytics',
    type: 'Internship',
    location: 'New York, NY',
    salary: '$40/hr',
    posted: '5 hours ago',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'InnovateHub',
    type: 'Contract',
    location: 'Austin, TX',
    salary: '$110k - $140k',
    posted: '1 week ago',
  }
];

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="jobs-page-container">
      <Navbar activeItem="Jobs & Internships" />
      <div className="page-header">
        <h1 className="page-title">Jobs & Internships</h1>
        <p className="page-subtitle">Discover career opportunities from our alumni network</p>
      </div>

      <div className="search-filter-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> Filters
        </button>
      </div>

      <p className="results-text">Showing {jobsData.length} of {jobsData.length} opportunities</p>

      <div className="jobs-grid">
        {jobsData.map((job) => (
          <div key={job.id} className="job-card">
            <div className="card-header">
              <div className="job-icon-wrapper">
                <Briefcase size={24} color="#10b981" />
              </div>
              <span className="job-badge">{job.type}</span>
            </div>

            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company}</p>

            <div className="job-details">
              <div className="detail-row">
                <MapPin size={16} className="detail-icon" />
                <span>{job.location}</span>
              </div>
              <div className="detail-row">
                <DollarSign size={16} className="detail-icon" />
                <span>{job.salary}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} className="detail-icon" />
                <span>Posted {job.posted}</span>
              </div>
            </div>

            <button className="apply-btn">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}