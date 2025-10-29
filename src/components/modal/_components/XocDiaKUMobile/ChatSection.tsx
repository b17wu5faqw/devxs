import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import { generateChatMessage, getRandomInterval } from '@/utils/chatSimulator';
import { format } from 'date-fns';
import { ChatSectionProps } from './types';

const ChatSection: React.FC<ChatSectionProps> = () => {
  const { messages, addMessage } = useChatStore();
  const [userInput, setUserInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Chat simulation for Xóc Đĩa (gameId: 1007) với tần suất thực tế hơn
  useEffect(() => {
    if (showChat) {
      // Clear existing simulation
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }

      const scheduleNextMessage = () => {
        const interval = getRandomInterval();
        simulationRef.current = setTimeout(() => {
          const newMessage = generateChatMessage(1007); // Xóc Đĩa game ID
          addMessage(newMessage);
          scheduleNextMessage(); // Schedule next message
        }, interval);
      };

      scheduleNextMessage();

      return () => {
        if (simulationRef.current) {
          clearTimeout(simulationRef.current);
        }
      };
    }
  }, [showChat, addMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      addMessage({
        username: 'Bạn',
        message: userInput.trim(),
        isUser: true,
        avatar: 'BẠ',
        avatarColor: '#3b82f6'
      });
      setUserInput('');
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  if (showChat) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        {/* Chat Header */}
        <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
          <div className="text-white font-medium">Phòng chat</div>
          <button 
            onClick={toggleChat}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="h-32 overflow-y-auto p-2 bg-gray-900"
        >
          {messages.slice(-20).map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex items-start gap-2 ${msg.isUser ? 'text-blue-400' : 'text-gray-300'}`}
            >
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{
                  backgroundColor: msg.avatarColor || '#4984c0'
                }}
              >
                {msg.avatar || msg.username.substring(0, 2).toUpperCase()}
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-xs">{msg.username}</span>
                  <span className="text-xs text-gray-500">
                    {format(msg.timestamp, 'HH:mm:ss')}
                  </span>
                </div>
                <div className="text-sm break-words">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form 
          onSubmit={handleSubmit}
          className="p-2 flex gap-2 bg-gray-800"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-full text-sm border border-gray-600 outline-none"
            placeholder="Nhập tin nhắn..."
          />
          <button 
            type="submit"
            disabled={!userInput.trim()}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              userInput.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Gửi
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black p-3 flex items-center gap-3 z-50 border-t border-gray-800" style={{ height: '60px' }}>
      <button 
        onClick={toggleChat}
        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600"
      >
        <span className="text-white text-sm">💬</span>
      </button>
      <input
        type="text"
        placeholder="Nhấn vào icon để mở chat"
        className="flex-1 bg-gray-800 text-gray-400 px-4 py-2 rounded-full text-sm placeholder-gray-400 border border-gray-700 outline-none h-9"
        disabled
      />
      <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatSection; 