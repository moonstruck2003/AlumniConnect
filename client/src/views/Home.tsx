import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Briefcase, Calendar,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import './Home.css';

export default function Home() {

  const stats = [
    { icon: <Users size={24} />, color: 'purple', label: 'Total Alumni', value: '12,450', trend: '+5.2%' },
    { icon: <TrendingUp size={24} />, color: 'green', label: 'Active Mentors', value: '842', trend: '+12.4%' },
    { icon: <Briefcase size={24} />, color: 'pink', label: 'Job Postings', value: '156', trend: '+8.1%' },
    { icon: <Calendar size={24} />, color: 'orange', label: 'Upcoming Events', value: '23', trend: '+3.5%' },
  ];

  const activities = [
    { avatar: 'S', color: 'blue', text: 'accepted your mentorship request', author: 'Sarah Johnson', time: '2 hours ago' },
    { avatar: 'T', color: 'indigo', text: 'posted a new Software Engineer position', author: 'Tech Corp', time: '5 hours ago' },
    { avatar: 'A', color: 'blue', text: 'Networking Mixer is happening next week', author: 'Alumni Event', time: '1 day ago' },
    { avatar: 'M', color: 'purple', text: 'joined as a mentor', author: 'Michael Chen', time: '2 days ago' },
  ];

  const quickActions = [
    { title: 'Find a Mentor', desc: 'Connect with experienced alumni' },
    { title: 'Browse Jobs', desc: 'Explore opportunities from alumni' },
    { title: 'View Directory', desc: 'Search for alumni by industry' },
    { title: 'Join Events', desc: 'Register for upcoming gatherings' },
  ];

  return (
    <div className="home-page">
      <div className="home-container">

        {/* Navigation Bar */}
        <Navbar activeItem="Dashboard" />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hero-card"
        >
          <div className="hero-content">
            <h1 className="hero-greeting">Welcome to AlumniConnect!</h1>
            <p className="hero-subtext">Stay connected with your university community, find mentors, and explore opportunities.</p>
          </div>
          {/* Abstract background elements could go here */}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="stats-grid"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="stat-card"
            >
              <div className="stat-header">
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="stat-trend">{stat.trend}</span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="content-grid">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="content-section"
          >
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              {activities.map((item, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-avatar ${item.color}`}>
                    {item.avatar}
                  </div>
                  <div className="activity-content">
                    <p><strong>{item.author}</strong> {item.text}</p>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="content-section"
          >
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-list">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="action-card"
                >
                  <div className="action-info">
                    <h4>{action.title}</h4>
                    <p>{action.desc}</p>
                  </div>
                  <ArrowRight size={18} className="action-arrow" />
                </motion.button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
