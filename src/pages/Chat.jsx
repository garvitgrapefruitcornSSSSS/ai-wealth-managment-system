// src/pages/Chat.jsx

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/firestoreService';
import { generateAIResponse, isGeminiConfigured } from '../services/geminiService';
import Navbar from '../components/Navbar';
import '../styles/Chat.css';

const Chat = () => {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const [userProfile, setUserProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
          
          // Add welcome message
          setMessages([
            {
              id: Date.now(),
              role: 'assistant',
              text: `Hi ${profile.name}! 👋 I'm your AI wealth advisor. I can see you earn ₹${profile.income.toLocaleString()} per month. I'm here to help you with financial planning, investment advice, budgeting tips, and achieving your goals. What would you like to discuss today?`,
              timestamp: new Date()
            }
          ]);
        }
      } catch (err) {
        setError('Failed to load your profile');
        console.error('Profile fetch error:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle message submission
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      setError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
      return;
    }

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: userMsg,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(userMsg, userProfile, messages);

      // Add AI message to chat
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI Response Error:', err);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "I apologize, but I'm having trouble processing your request right now. This could be due to API connectivity issues. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Suggested questions
  const suggestedQuestions = [
    "How can I save more money each month?",
    "What investments should I consider?",
    "How can I reduce my expenses?",
    "Should I pay off my loans faster?",
    "Help me create a budget plan"
  ];

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  if (profileLoading) {
    return (
      <>
        <Navbar />
        <div className="chat-container">
          <div className="loading">Loading your financial profile...</div>
        </div>
      </>
    );
  }

  if (!userProfile) {
    return (
      <>
        <Navbar />
        <div className="chat-container">
          <div className="error-message">Unable to load profile. Please complete your onboarding first.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <h2>💬 AI Wealth Advisor</h2>
          <p>Get personalized financial advice based on your profile</p>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && !loading && (
          <div className="suggestions-container">
            <p className="suggestions-label">Suggested questions:</p>
            <div className="suggestions-grid">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="suggestion-chip"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            disabled={loading}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={loading || !inputMessage.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;