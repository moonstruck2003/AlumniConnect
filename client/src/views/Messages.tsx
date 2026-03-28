import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Loader2, MessageSquare, PlusCircle } from 'lucide-react';
import ApiClient from '../api';
import Navbar from '../components/Navbar';
import './Messages.css';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface ChatUser {
  id: number;
  name: string;
  job_title: string;
  company: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<ChatUser[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const api = new ApiClient();

  useEffect(() => {
    // If navigated from profile with a pre-selected user
    if (location.state && location.state.selectedUser) {
        setActiveUser(location.state.selectedUser);
        if (!conversations.find((c) => c.id === location.state.selectedUser.id)) {
            setConversations(prev => [location.state.selectedUser, ...prev]);
        }
    }
  }, [location]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
      
      // Polling for MVP real-time updates
      const interval = setInterval(() => {
        fetchMessages(activeUser.id, false);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchMessages = async (userId: number, showLoading = true) => {
    if (showLoading) setIsLoadingMessages(true);
    try {
      const data = await api.getConversation(userId);
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      if (showLoading) setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    // Optimistic update
    const tempMessage: Message = {
      id: Date.now(),
      sender_id: user?.id || 0,
      receiver_id: activeUser.id,
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    try {
      await api.sendMessage(activeUser.id, tempMessage.content);
      // Ensure we have correct backend data by soft re-fetching
      fetchMessages(activeUser.id, false);
      
      // Update conversations if it's a new chat
      if (!conversations.find(c => c.id === activeUser.id)) {
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="messages-page-wrapper">
      <Navbar activeItem="Messages" />
      
      <div className="messages-container">
        <motion.div 
          className="chat-sidebar"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="sidebar-header">
            <h2>Messages</h2>
          </div>
          
          <div className="conversations-list">
            {isLoadingChats ? (
              <div className="loading-state">
                <Loader2 className="spinner" size={24} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={32} />
                <p>No conversations yet</p>
                <span>Find an alumni to start chatting</span>
              </div>
            ) : (
              conversations.map((chatUser) => (
                <div 
                  key={chatUser.id}
                  className={`conversation-item ${activeUser?.id === chatUser.id ? 'active' : ''}`}
                  onClick={() => setActiveUser(chatUser)}
                >
                  <div className="avatar">
                    <UserIcon size={20} />
                  </div>
                  <div className="user-details">
                    <h6>{chatUser.name}</h6>
                    <span>{chatUser.job_title} {chatUser.company ? `@ ${chatUser.company}` : ''}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div 
          className="chat-main"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {activeUser ? (
            <>
              <div className="chat-header">
                <div className="avatar">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h4>{activeUser.name}</h4>
                  <span>{activeUser.job_title}</span>
                </div>
              </div>

              <div className="chat-history">
                {isLoadingMessages ? (
                   <div className="loading-state h-100">
                    <Loader2 className="spinner" size={24} />
                   </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === user?.id;
                      return (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`message-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}
                        >
                          {!isMine && (
                            <div className="avatar small">
                              <UserIcon size={14} />
                            </div>
                          )}
                          <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                            <p>{msg.content}</p>
                            <span className="timestamp">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <div className="placeholder-icon">
                <MessageSquare size={48} />
              </div>
              <h3>Select a conversation</h3>
              <p>Choose an existing conversation or start a new one from the directory.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
