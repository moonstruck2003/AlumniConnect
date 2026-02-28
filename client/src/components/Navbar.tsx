import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users, Briefcase, Calendar,
    BookOpen, LayoutDashboard, Menu, X, Info
} from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
    activeItem?: 'Dashboard' | 'Alumni Directory' | 'Mentorship' | 'Jobs & Internships' | 'Events' | 'About Us';
}

export default function Navbar({ activeItem = 'Dashboard' }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authFlag = localStorage.getItem('isAuthenticated');
        setIsAuthenticated(authFlag === 'true');
    }, []);

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
                    <Link to="/" className={`nav-item ${activeItem === 'Dashboard' ? 'active' : ''}`}><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/alumni" className={`nav-item ${activeItem === 'Alumni Directory' ? 'active' : ''}`}><Users size={18} /> Alumni Directory</Link>
                    <a href="#" className={`nav-item ${activeItem === 'Mentorship' ? 'active' : ''}`}><BookOpen size={18} /> Mentorship</a>
                    <a href="#" className={`nav-item ${activeItem === 'Jobs & Internships' ? 'active' : ''}`}><Briefcase size={18} /> Jobs & Internships</a>
                    <a href="#" className={`nav-item ${activeItem === 'Events' ? 'active' : ''}`}><Calendar size={18} /> Events</a>
                    <Link to="/about" className={`nav-item ${activeItem === 'About Us' ? 'active' : ''}`}><Info size={18} /> About Us</Link>
                </div>

                {!isAuthenticated && (
                    <div className="nav-auth">
                        <Link to="/login" className="btn-login">Login</Link>
                        <Link to="/signup" className="btn-signup">Sign up</Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}