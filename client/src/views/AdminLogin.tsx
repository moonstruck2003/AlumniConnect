import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { secrets } from '../secrets';
import './Login.css';

const API_BASE = secrets.backendEndpoint || 'http://localhost:8000';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ email: email.includes('@') ? email : `${email}@admin.com`, password }),
            });

            const result = await response.json();

            if (response.ok && result.token && result.user) {
                if (result.user.role !== 'admin') {
                    setMessage('Access Denied: Not an administrator account.');
                    setMessageType('error');
                    return;
                }
                setMessage('Admin access granted!');
                setMessageType('success');
                authLogin(result.token, result.user);
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setMessage(result.message || 'Invalid admin credentials');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Connection failed. Please ensure the backend is running.');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page admin-login-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="login-container"
                style={{ maxWidth: '900px' }}
            >
                <div className="login-left" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    <div className="hero-icon" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        <Shield size={40} className="text-emerald-400" />
                    </div>
                    <div className="hero-text-container">
                        <h2 className="hero-title">Admin Terminal</h2>
                        <p className="hero-subtitle">
                           Secure portal for AlumniConnect administrators. 
                           Access restricted to authorized personnel only.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="form-wrapper">
                        <div className="form-header text-center">
                            <h3 className="form-title">Administrator Login</h3>
                            <p className="form-subtitle">Enter your secure credentials</p>
                        </div>

                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}
                                style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px' }}
                            >
                                {message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label className="input-label">Admin Username</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><User size={20} /></div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                        placeholder="Username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Security Password</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><Lock size={20} /></div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                                style={{ background: '#10b981', marginTop: '1rem' }}
                            >
                                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                                <motion.div
                                    animate={{ x: isHovered ? 5 : 0 }}
                                    className="submit-icon"
                                >
                                    <ArrowRight size={18} />
                                </motion.div>
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
