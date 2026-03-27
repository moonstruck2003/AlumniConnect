import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Users, Briefcase, Calendar,
    BookOpen, LayoutDashboard, Menu, X, Info, LogOut, UserCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

interface NavbarProps {
    activeItem?: 'Dashboard' | 'Alumni Directory' | 'Mentorship' | 'Jobs & Internships' | 'Events' | 'About Us' | 'Profile';
}

export default function Navbar({ activeItem = 'Dashboard' }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="home-nav"
        >
            <Link to="/" className="nav-brand">
                <div className="brand-icon">
                    <span style={{ fontWeight: 800 }}>AC</span>
                </div>
                <div className="brand-title">
                    <span className="brand-name">AlumniConnect</span>
                    <span className="brand-subtitle">University Network</span>
                </div>
            </Link>

            <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="nav-links">
                    <Link to="/dashboard" className={`nav-item ${activeItem === 'Dashboard' ? 'active' : ''}`}><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/alumni" className={`nav-item ${activeItem === 'Alumni Directory' ? 'active' : ''}`}><Users size={18} /> Alumni Directory</Link>
                    <Link to="/mentorship" className={`nav-item ${activeItem === 'Mentorship' ? 'active' : ''}`}><BookOpen size={18} /> Mentorship</Link>
                    <Link to="/jobs" className={`nav-item ${activeItem === 'Jobs & Internships' ? 'active' : ''}`}><Briefcase size={18} /> Jobs & Internships</Link>
                    <Link to="/events" className={`nav-item ${activeItem === 'Events' ? 'active' : ''}`}><Calendar size={18} /> Events</Link>
                    <Link to="/about" className={`nav-item ${activeItem === 'About Us' ? 'active' : ''}`}><Info size={18} /> About Us</Link>
                    {user?.role === 'recruiter' && (
                        <Link to="/profile" className={`nav-item ${activeItem === 'Profile' ? 'active' : ''}`}><UserCircle size={18} /> Profile</Link>
                    )}
                </div>

                {isAuthenticated ? (
                    <div className="nav-auth">
                        <button type="button" onClick={handleLogout} className="btn-logout">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="nav-auth">
                        <Link to="/login" className="btn-login">Login</Link>
                        <Link to="/signup" className="btn-signup">Sign up</Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}