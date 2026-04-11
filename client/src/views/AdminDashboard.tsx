import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, UserX, Search, Filter, Shield, Loader2, CheckCircle, XCircle, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from '../components/Navbar';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const api = new ApiClient();

type UserRole = 'alumni' | 'student' | 'recruiter' | 'admin';

interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_verified: boolean;
    job_title?: string;
    company?: string;
    department?: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<Record<string, User[]>>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<UserRole>('alumni');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getAdminUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerifyToken = async (id: number) => {
        setUpdatingId(id);
        try {
            const response = await api.toggleUserVerification(id);
            setUsers(prev => {
                const updated = { ...prev };
                updated[activeTab] = updated[activeTab].map(u => 
                    u.id === id ? { ...u, is_verified: response.is_verified } : u
                );
                return updated;
            });
            toast.success(response.is_verified ? 'User Verified' : 'Verification Revoked');
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = (users[activeTab] || []).filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: Object.values(users).flat().filter(u => u.role !== 'admin').length,
        verified: Object.values(users).flat().filter(u => u.is_verified && u.role !== 'admin').length,
        pending: Object.values(users).flat().filter(u => !u.is_verified && u.role !== 'admin').length,
    };

    return (
        <div className="admin-dashboard">
            <Navbar activeItem="Admin" />
            
            <div className="admin-container">
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-header"
                >
                    <div className="header-info">
                        <div className="title-wrapper">
                            <Shield className="admin-title-icon" />
                            <h1>Admin Console</h1>
                        </div>
                        <p>Real-time user management & account verification</p>
                    </div>
                    
                    <div className="header-stats">
                        <div className="stat-pill total">
                            <Users size={16} />
                            <span>{stats.total} Users</span>
                        </div>
                        <div className="stat-pill verified">
                            <CheckCircle size={16} />
                            <span>{stats.verified} Verified</span>
                        </div>
                    </div>
                </motion.header>

                <div className="admin-controls-card glass">
                    <div className="controls-row">
                        <div className="role-tabs">
                            {['alumni', 'student', 'recruiter'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setActiveTab(role as UserRole)}
                                    className={`tab-btn ${activeTab === role ? 'active' : ''}`}
                                >
                                    {role}s
                                </button>
                            ))}
                        </div>

                        <div className="search-wrapper">
                            <Search className="search-icon" size={18} />
                            <input 
                                type="text" 
                                placeholder={`Search for ${activeTab}s...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="user-table-wrapper">
                        {loading ? (
                            <div className="loading-container">
                                <Loader2 className="spinner" size={40} />
                                <p>Accessing user database...</p>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Professional Profile</th>
                                        <th>Department / Affiliation</th>
                                        <th className="text-center">Verification</th>
                                        <th className="text-right">Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence mode='popLayout'>
                                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                            <motion.tr 
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={user.id} 
                                                className="table-row"
                                            >
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-small">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="user-meta">
                                                            <span className="user-name">{user.name}</span>
                                                            <span className="user-email">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="dept-cell">
                                                        {user.job_title ? (
                                                            <>
                                                                <Briefcase size={12} />
                                                                <span>{user.job_title} @ {user.company}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <GraduationCap size={12} />
                                                                <span>{user.department || 'General Member'}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className={`status-badge ${user.is_verified ? 'verified' : 'pending'}`}>
                                                        {user.is_verified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                        {user.is_verified ? 'Verified' : 'Pending'}
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => handleVerifyToken(user.id)}
                                                        disabled={updatingId === user.id}
                                                        className={`action-btn ${user.is_verified ? 'revoke' : 'verify'}`}
                                                    >
                                                        {updatingId === user.id ? '...' : (user.is_verified ? 'Revoke Status' : 'Verify Account')}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="empty-row">
                                                    No results found for your search criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .admin-dashboard {
                    min-height: 100vh;
                    background-color: #0b0f19;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
                }
                .admin-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2.5rem 1.5rem;
                }
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 2.5rem;
                }
                .title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .admin-title-icon {
                    color: #10b981;
                    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
                }
                .admin-header h1 {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: white;
                    margin: 0;
                }
                .admin-header p {
                    color: #94a3b8;
                    font-size: 1.125rem;
                }
                .header-stats {
                    display: flex;
                    gap: 1rem;
                }
                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    border-radius: 99px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .stat-pill.total { 
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .stat-pill.verified { 
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border-color: rgba(16, 185, 129, 0.2);
                }

                .glass {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .admin-controls-card {
                    padding: 1.5rem;
                }
                .controls-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    gap: 1.5rem;
                }
                .role-tabs {
                    display: flex;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.375rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .tab-btn {
                    padding: 0.625rem 1.5rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #94a3b8;
                    transition: all 0.2s;
                    text-transform: capitalize;
                }
                .tab-btn.active {
                    background: #10b981;
                    color: white;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                }
                .tab-btn:hover:not(.active) {
                    color: white;
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }
                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }
                .search-wrapper input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    color: white;
                    transition: all 0.2s;
                    font-size: 0.9375rem;
                }
                .search-wrapper input:focus {
                    outline: none;
                    border-color: #10b981;
                    background: rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }

                .user-table-wrapper {
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .admin-table th {
                    background: rgba(255, 255, 255, 0.02);
                    padding: 1.25rem 1.5rem;
                    text-align: left;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #64748b;
                }
                .table-row {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
                    transition: all 0.2s;
                }
                .table-row:hover {
                    background: rgba(255, 255, 255, 0.01);
                }

                .user-cell {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                }
                .user-avatar-small {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1.125rem;
                }
                .user-meta {
                    display: flex;
                    flex-direction: column;
                }
                .user-name {
                    font-weight: 600;
                    color: white;
                    font-size: 0.9375rem;
                }
                .user-email {
                    color: #64748b;
                    font-size: 0.8125rem;
                }

                .dept-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    padding: 0 1.5rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.875rem;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.025em;
                }
                .status-badge.verified {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }
                .status-badge.pending {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }

                .action-btn {
                    padding: 0.625rem 1.125rem;
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    font-weight: 700;
                    transition: all 0.2s;
                    margin: 0 1.5rem;
                }
                .action-btn.verify {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }
                .action-btn.verify:hover {
                    background: #10b981;
                    color: white;
                }
                .action-btn.revoke {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .action-btn.revoke:hover {
                    background: #ef4444;
                    color: white;
                }

                .loading-container {
                    padding: 5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    color: #64748b;
                }
                .spinner {
                    color: #10b981;
                    animation: spin 1s linear infinite;
                }
                .empty-row {
                    padding: 5rem;
                    text-align: center;
                    color: #64748b;
                    font-style: italic;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .text-center { text-align: center; }
                .text-right { text-align: right; }
            `}</style>
        </div>
    );
}
