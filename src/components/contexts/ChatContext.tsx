// frontend/src/components/contexts/ChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface Chat {
  requestId: any;
  lastMessage: any;
  id: string;
  participants: Array<{
    userId: string;
    name: string;
    role: 'admin' | 'therapist' | 'customer';
  }>;
  messages: Message[];
  isActive: boolean;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string, chatId: string) => void;
  loading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockChats: Chat[] = [
    {
      id: '1',
      participants: [
        { userId: '1', name: 'Admin User', role: 'admin' },
        { userId: '2', name: 'Sarah Wilson', role: 'therapist' }
      ],
      messages: [
        {
          id: '1',
          content: 'Hello Sarah, how was your last session?',
          senderId: '1',
          senderName: 'Admin User',
          timestamp: new Date('2024-01-15T10:00:00'),
          type: 'text'
        },
        {
          id: '2',
          content: 'It went well! The customer was very happy with the deep tissue massage.',
          senderId: '2',
          senderName: 'Sarah Wilson',
          timestamp: new Date('2024-01-15T10:05:00'),
          type: 'text'
        }
      ],
      isActive: true,
      requestId: '1',
      lastMessage: undefined
    }
  ];

  const sendMessage = (content: string, chatId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: '1', // Assuming admin is sending
      senderName: 'Admin User',
      timestamp: new Date(),
      type: 'text'
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    // Update active chat if it's the one we're messaging in
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(prev => 
        prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
      );
    }
  };

  // Initialize with mock data
  React.useEffect(() => {
    setChats(mockChats);
  }, []);

  const value: ChatContextType = {
    chats,
    activeChat,
    setActiveChat,
    sendMessage,
    loading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};