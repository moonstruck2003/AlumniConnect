import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Key } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import './Login.css';

const api = new ApiClient();

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState(false);

    const email = searchParams.get('email');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!email || !token) {
            setMessage('Invalid recovery link. Please request a new one.');
            setMessageType('error');
        }
    }, [email, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== passwordConfirmation) {
            setMessage('Passwords do not match');
            setMessageType('error');
            return;
        }

        setMessage('');
        setMessageType('');
        setIsLoading(true);

        try {
            await api.resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation
            });
            setMessage('Your password has been reset successfully! Redirecting to login...');
            setMessageType('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setMessageType('error');
            setMessage('Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
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
                        <Key size={40} />
                    </div>
                    <div className="hero-text-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            <h2 className="hero-title">New Password</h2>
                            <p className="hero-subtitle">
                                Set a strong password to keep your alumni account secure.
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
                            <h3 className="form-title">Reset Password</h3>
                            <p className="form-subtitle">
                                Please enter your new password below.
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
                                <label className="input-label">New Password</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input"
                                        placeholder="Min. 8 characters"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <div className="input-icon">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="form-input"
                                        placeholder="Repeat new password"
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
                                disabled={isLoading || !email || !token}
                            >
                                {isLoading ? 'Updating...' : 'Reset Password'}
                                <motion.div
                                    animate={{ x: isHovered ? 4 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="submit-icon"
                                >
                                    <ArrowRight size={16} />
                                </motion.div>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
