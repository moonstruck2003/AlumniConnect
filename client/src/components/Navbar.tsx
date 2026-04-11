import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    Users, Briefcase, Calendar, User as UserIcon,
    BookOpen, LayoutDashboard, Menu, X, Info, LogOut, MessageSquare, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../api';
import './Navbar.css';
import { useEffect } from 'react';

interface NavbarProps {
    activeItem?: 'Dashboard' | 'Alumni Directory' | 'Mentorship' | 'Jobs & Internships' | 'Events' | 'About Us' | 'Profile' | 'Messages' | 'Admin';
}

export default function Navbar({ activeItem = 'Dashboard' }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const [countsByType, setCountsByType] = useState<{[key: string]: number}>({
        message: 0,
        job_application: 0,
        mentorship: 0,
        event: 0
    });
    const navigate = useNavigate();
    const api = new ApiClient();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCounts();
            // Polling for notifications every 30 seconds
            const interval = setInterval(fetchCounts, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchCounts = async () => {
        try {
            const data = await api.getNotificationCountsByType();
            if (data && data.success) {
                setCountsByType(data.counts);
            }
        } catch (error) {
            console.error('Failed to fetch counts', error);
        }
    };

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
                    
                    {user?.role !== 'admin' && (
                        <>
                            <Link to="/mentorship" className={`nav-item ${activeItem === 'Mentorship' ? 'active' : ''}`}>
                                <div className="nav-icon-badge-wrapper">
                                    <BookOpen size={18} />
                                    {countsByType.mentorship > 0 && <span className="nav-badge-small">{countsByType.mentorship}</span>}
                                </div>
                                Mentorship
                            </Link>

                            <Link to="/jobs" className={`nav-item ${activeItem === 'Jobs & Internships' ? 'active' : ''}`}>
                                <div className="nav-icon-badge-wrapper">
                                    <Briefcase size={18} />
                                    {countsByType.job_application > 0 && <span className="nav-badge-small">{countsByType.job_application}</span>}
                                </div>
                                Jobs & Internships
                            </Link>
                        </>
                    )}

                    <Link to="/events" className={`nav-item ${activeItem === 'Events' ? 'active' : ''}`}>
                        <div className="nav-icon-badge-wrapper">
                            <Calendar size={18} />
                            {countsByType.event > 0 && <span className="nav-badge-small">{countsByType.event}</span>}
                        </div>
                        Events
                    </Link>

                    <Link to="/about" className={`nav-item ${activeItem === 'About Us' ? 'active' : ''}`}><Info size={18} /> About Us</Link>
                    
                    {isAuthenticated && (
                        <>
                            {user?.role !== 'admin' && (
                                <>
                                    <Link to="/messages" className={`nav-item ${activeItem === 'Messages' ? 'active' : ''}`}>
                                        <div className="nav-icon-badge-wrapper">
                                            <MessageSquare size={18} />
                                            {countsByType.message > 0 && <span className="nav-badge-small">{countsByType.message}</span>}
                                        </div>
                                        Messages
                                    </Link>
                                    <Link to="/profile" className={`nav-item ${activeItem === 'Profile' ? 'active' : ''}`}><UserIcon size={18} /> Profile</Link>
                                </>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" className={`nav-item ${activeItem === 'Admin' ? 'active' : ''}`}><Shield size={18} /> Admin Console</Link>
                            )}
                        </>
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