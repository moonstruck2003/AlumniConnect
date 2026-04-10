import { useState, useEffect } from 'react';
import { MessageSquare, Briefcase, Users, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import './NotificationDropdown.css';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: number;
    name: string;
  };
}

interface NotificationDropdownProps {
  onClose: () => void;
  onRefreshCount: () => void;
}

export default function NotificationDropdown({ onClose, onRefreshCount }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api = new ApiClient();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (data && data.success) {
        setNotifications(data.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number, link: string) => {
    try {
      await api.markNotificationRead(id);
      onRefreshCount();
      onClose();
      if (link) navigate(link);
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      onRefreshCount();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={18} />;
      case 'job_application': return <Briefcase size={18} />;
      case 'mentorship': return <Users size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-dropdown">
      <div className="dropdown-header">
        <h3>Notifications</h3>
        {notifications.some(n => !n.is_read) && (
          <button className="mark-all-read" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="empty-notifications">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(notif.id, notif.link)}
            >
              <div className={`notif-icon ${notif.type}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notif-content">
                <span className="notif-title">{notif.title}</span>
                <span className="notif-msg">{notif.message}</span>
                <span className="notif-time">{formatTime(notif.created_at)}</span>
              </div>
              {!notif.is_read && <div className="notif-unread-dot" />}
            </div>
          ))
        )}
      </div>

      <div className="dropdown-footer">
        <button className="view-all" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
