import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, BookOpen } from 'lucide-react';
import './Login.css'; 

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setMessage('Reset link sent successfully.');
        setMessageType('success');
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="login-container"
            >
                <div className="login-left">
                    <div className="hero-icon">
                        <BookOpen size={40} />
                    </div>
                    <div className="hero-text-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <h2 className="hero-title">Reset Password</h2>
                            <p className="hero-subtitle">
                                Don't worry, we'll help you get back into your account.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="login-right">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="form-wrapper"
                    >
                        <div className="form-header">
                            <h3 className="form-title">Forgot Password</h3>
                            <p className="form-subtitle">
                                Enter the email associated with your account and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {message && (
                            <div
                                className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}
                                style={{
                                    marginBottom: '1rem',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '1rem',
                                }}
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                        placeholder="you@university.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                type="submit"
                                className="submit-btn"
                            >
                                Send Reset Link
                                <motion.div
                                    animate={{ x: isHovered ? 4 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="submit-icon"
                                >
                                    <ArrowRight size={16} />
                                </motion.div>
                            </motion.button>
                        </form>

                        <div className="signup-text">
                            <p>
                                Remembered your password?{' '}
                                <a href="/login" className="signup-link">
                                    Log in
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
