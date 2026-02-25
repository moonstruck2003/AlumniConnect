import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, BookOpen, User, Briefcase, GraduationCap, Building2, BadgeInfo, FileText } from 'lucide-react';
import './Signup.css';

type Role = 'alumni' | 'student' | 'recruiter';

export default function Signup() {
    const [role, setRole] = useState<Role>('alumni');
    const [isHovered, setIsHovered] = useState(false);

    // Users Table
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // User Profiles Table
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    // Student Table
    const [studentId, setStudentId] = useState('');
    const [department, setDepartment] = useState('');
    const [cgpa, setCgpa] = useState('');

    // Alumni Table
    const [alumniJobTitle, setAlumniJobTitle] = useState('');
    const [alumniCompany, setAlumniCompany] = useState('');

    // Recruiters Table
    const [recruiterCompanyName, setRecruiterCompanyName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            user: { email, password, role },
            profile: { firstName, lastName, bio, linkedinUrl },
            ...(role === 'student' && { student: { studentId, department, cgpa } }),
            ...(role === 'alumni' && { alumni: { jobTitle: alumniJobTitle, company: alumniCompany } }),
            ...(role === 'recruiter' && { recruiter: { companyName: recruiterCompanyName } })
        };
        console.log('Signup submitted:', payload);
    };

    return (
        <div className="signup-page">

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="signup-container"
            >

                {/* Left Side - Visual/Branding */}
                <div className="signup-left">
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
                                Join Our Global <br /> Network
                            </h2>
                            <p className="hero-subtitle">
                                Create an account to connect with peers, discover exclusive opportunities, and engage with your alma mater.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="signup-right">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="form-wrapper"
                    >
                        <div className="form-header">
                            <h3 className="form-title">Create an Account</h3>
                            <p className="form-subtitle">Fill in your details to get started with AlumniConnect.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="signup-form">

                            {/* Role Selection */}
                            <div className="role-selector">
                                <label className="input-label">I am a...</label>
                                <div className="role-cards">
                                    <button
                                        type="button"
                                        className={`role-card ${role === 'alumni' ? 'active' : ''}`}
                                        onClick={() => setRole('alumni')}
                                    >
                                        <User size={20} className="role-icon" />
                                        <span>Alumni</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-card ${role === 'student' ? 'active' : ''}`}
                                        onClick={() => setRole('student')}
                                    >
                                        <GraduationCap size={20} className="role-icon" />
                                        <span>Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-card ${role === 'recruiter' ? 'active' : ''}`}
                                        onClick={() => setRole('recruiter')}
                                    >
                                        <Briefcase size={20} className="role-icon" />
                                        <span>Recruiter</span>
                                    </button>
                                </div>
                            </div>

                            <div className="scrollable-fields">
                                <h4 className="section-title">Account Details</h4>
                                <div className="form-row">
                                    {/* First Name */}
                                    <div className="input-group">
                                        <label className="input-label">First Name</label>
                                        <div className="input-wrapper">
                                            <div className="input-icon">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="form-input"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Last Name */}
                                    <div className="input-group">
                                        <label className="input-label">Last Name</label>
                                        <div className="input-wrapper">
                                            <div className="input-icon">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="form-input"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                    <label className="input-label">Password</label>
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

                                <div className="input-group">
                                    <label className="input-label">LinkedIn URL (Optional)</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon">
                                            <BadgeInfo size={20} />
                                        </div>
                                        <input
                                            type="url"
                                            value={linkedinUrl}
                                            onChange={(e) => setLinkedinUrl(e.target.value)}
                                            className="form-input"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Short Bio (Optional)</label>
                                    <div className="input-wrapper">
                                        <div className="input-icon" style={{ alignItems: 'flex-start', paddingTop: '0.75rem' }}>
                                            <FileText size={20} />
                                        </div>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="form-input"
                                            placeholder="Tell us a bit about yourself..."
                                            rows={3}
                                            style={{ resize: 'vertical', minHeight: '80px' }}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {/* Role Specific Fields */}
                                    {role === 'student' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="role-specific-section"
                                        >
                                            <h4 className="section-title">Student Information</h4>
                                            <div className="form-row">
                                                <div className="input-group">
                                                    <label className="input-label">Student ID</label>
                                                    <div className="input-wrapper">
                                                        <div className="input-icon"><BadgeInfo size={20} /></div>
                                                        <input
                                                            type="text"
                                                            value={studentId}
                                                            onChange={(e) => setStudentId(e.target.value)}
                                                            className="form-input"
                                                            placeholder="e.g. 2024-1-60-XXX"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <label className="input-label">CGPA</label>
                                                    <div className="input-wrapper">
                                                        <div className="input-icon"><FileText size={20} /></div>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max="4.0"
                                                            value={cgpa}
                                                            onChange={(e) => setCgpa(e.target.value)}
                                                            className="form-input"
                                                            placeholder="e.g. 3.85"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Department</label>
                                                <div className="input-wrapper">
                                                    <div className="input-icon"><Building2 size={20} /></div>
                                                    <input
                                                        type="text"
                                                        value={department}
                                                        onChange={(e) => setDepartment(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Computer Science"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {role === 'alumni' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="role-specific-section"
                                        >
                                            <h4 className="section-title">Professional Detail</h4>
                                            <div className="input-group">
                                                <label className="input-label">Current Job Title</label>
                                                <div className="input-wrapper">
                                                    <div className="input-icon"><Briefcase size={20} /></div>
                                                    <input
                                                        type="text"
                                                        value={alumniJobTitle}
                                                        onChange={(e) => setAlumniJobTitle(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Software Engineer"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label className="input-label">Company</label>
                                                <div className="input-wrapper">
                                                    <div className="input-icon"><Building2 size={20} /></div>
                                                    <input
                                                        type="text"
                                                        value={alumniCompany}
                                                        onChange={(e) => setAlumniCompany(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Google"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {role === 'recruiter' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="role-specific-section"
                                        >
                                            <h4 className="section-title">Company Detail</h4>
                                            <div className="input-group">
                                                <label className="input-label">Company Name</label>
                                                <div className="input-wrapper">
                                                    <div className="input-icon"><Building2 size={20} /></div>
                                                    <input
                                                        type="text"
                                                        value={recruiterCompanyName}
                                                        onChange={(e) => setRecruiterCompanyName(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Acme Corp"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Signup Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                                type="submit"
                                className="submit-btn"
                            >
                                Create Account
                                <motion.div
                                    animate={{ x: isHovered ? 4 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="submit-icon"
                                >
                                    <ArrowRight size={16} />
                                </motion.div>
                            </motion.button>
                        </form>

                        <div className="login-text">
                            <p>
                                Already have an account?{' '}
                                <a href="/login" className="login-link">
                                    Sign in
                                </a>
                            </p>
                        </div>

                    </motion.div>
                </div>
            </motion.div>

        </div>
    );
}
