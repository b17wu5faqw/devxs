import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  isUser?: boolean;
  avatar?: string;
  avatarColor?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) => 
        set((state) => {
          const newMessage = {
            ...message,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
          };
          
          const newMessages = [newMessage, ...state.messages].slice(0, 1000);
          return { messages: newMessages };
        }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage',
    }
  )
); 