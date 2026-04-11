import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import ApiClient from '../api';
import './AiChatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AlumniConnect assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const api = new ApiClient();
      const response = await api.chatWithAi(inputValue);

      if (response && response.success) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="ai-chatbot-container">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={22} color="white" />
              </div>
              <div>
                <h3>AlumniBot AI</h3>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button className="send-btn" onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-bubble" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} color="white" />
        </button>
      )}
    </div>
  );
};

export default AiChatbot;
