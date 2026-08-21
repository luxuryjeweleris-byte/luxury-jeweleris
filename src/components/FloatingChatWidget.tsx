'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';
import './components.css';

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'expert' | 'user'; text: string; time: string }>>([
    {
      sender: 'expert',
      text: 'Hi there! 👋 I am Sarah, your GIA-certified Diamond Expert. How can I help you customize your dream ring today?',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setInputVal('');

    // Simulated Expert Response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'expert',
          text: 'Thank you for reaching out! Let me fetch the best diamond specs for you right away. 💎',
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <button
        id="rc-floating-chat-btn"
        className="rc-floating-chat-launcher"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with Diamond Expert"
      >
        <MessageSquare size={24} color="#ffffff" fill="#ffffff" />
        <span className="rc-chat-badge-dot" />
      </button>

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="rc-chat-window animate-fade-in">
          {/* Header */}
          <div className="rc-chat-header">
            <div className="rc-chat-header-info">
              <div className="rc-chat-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop" 
                  alt="Diamond Expert" 
                  className="rc-chat-avatar-img" 
                />
                <span className="rc-chat-avatar-status" />
              </div>
              <div>
                <div className="rc-chat-name">Sarah Jenkins <ShieldCheck size={13} color="#0E8C8A" style={{ verticalAlign: 'middle', marginLeft: '3px', display: 'inline-block' }} /></div>
                <div className="rc-chat-role">GIA Certified Diamond Expert • Online</div>
              </div>
            </div>
            <button className="rc-chat-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="rc-chat-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`rc-chat-bubble-row ${m.sender === 'user' ? 'user' : 'expert'}`}>
                <div className="rc-chat-bubble">
                  <p>{m.text}</p>
                  <span className="rc-chat-time">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Input */}
          <div className="rc-chat-footer">
            <input 
              type="text" 
              placeholder="Ask a diamond expert..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="rc-chat-input"
            />
            <button className="rc-chat-send-btn" onClick={handleSend}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatWidget;
