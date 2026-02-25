import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic would be here
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="login-page">
      
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="login-container"
      >
        
        {/* Left Side - Visual/Branding */}
        <div className="login-left">
          {/* Abstract floating shapes */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="shape-1"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -10, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="shape-2"
          />

          <div className="brand-container">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div className="brand-icon">
                <BookOpen size={24} />
              </div>
              <span className="brand-text">AlumniConnect</span>
            </motion.div>
          </div>

          <div className="hero-text-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="hero-title">
                Inspire the Next <br /> Generation
              </h2>
              <p className="hero-subtitle">
                Connect with mentors, find exclusive opportunities, and give back to your alma mater community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="form-wrapper"
          >
            <div className="form-header">
              <h3 className="form-title">Welcome Back</h3>
              <p className="form-subtitle">Please enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Input */}
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

              {/* Password Input */}
              <div className="input-group">
                <div className="input-header">
                  <label className="input-label">Password</label>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <Lock size={20} />
                  </div>
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

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="submit-btn"
              >
                Sign In
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
                Don't have an account yet?{' '}
                <a href="#" className="signup-link">
                  Apply for access
                </a>
              </p>
            </div>

          </motion.div>
        </div>
      </motion.div>

    </div>
  );
}
