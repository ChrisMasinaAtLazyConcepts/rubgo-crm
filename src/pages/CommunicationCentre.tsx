// frontend/src/pages/CommunicationCenter.tsx
import React, { useState, useEffect } from 'react';
import { useChat } from '../components/contexts/ChatContext';

interface ChatParticipant {
  userId: string;
  name: string;
  role: 'customer' | 'therapist' | 'admin' | 'support';
}

interface Chat {
  id: string;
  participants: ChatParticipant[];
  lastMessage: string;
  requestId: string;
  isActive: boolean;
  lastMessageTime: string;
}

const CommunicationCenter: React.FC = () => {
  const { chats, activeChat, setActiveChat, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [activeChats, setActiveChats] = useState<Chat[]>([]);

  useEffect(() => {
    // Transform the chats from context to match our local structure
    const transformedChats: Chat[] = chats.map(chat => ({
      id: chat.id,
      participants: chat.participants,
      lastMessage: chat.lastMessage?.content || 'No messages yet',
      requestId: chat.requestId,
      isActive: chat.isActive,
      lastMessageTime: chat.lastMessage?.sentAt ? new Date(chat.lastMessage.sentAt).toISOString() : new Date().toISOString()
    }));
    
    setActiveChats(transformedChats);
  }, [chats]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    sendMessage(newMessage, activeChat.id);
    setNewMessage('');
  };

  const handleChatSelect = (chat: Chat) => {
    const contextChat = chats.find(c => c.id === chat.id);
    if (contextChat) {
      setActiveChat(contextChat);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
    }
  };

  const getChatTitle = (chat: Chat) => {
    const otherParticipant = chat.participants.find(p => p.role !== 'admin' && p.role !== 'support');
    return otherParticipant?.name || 'Unknown User';
  };

  const getChatSubtitle = (chat: Chat) => {
    const roles = chat.participants.map(p => p.role).filter(role => role !== 'admin' && role !== 'support');
    if (roles.length > 0) {
      return roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(' & ');
    }
    return 'Conversation';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Communication Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Active Conversations</h2>
            <p className="text-sm text-gray-600 mt-1">{activeChats.length} active chats</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {getChatTitle(chat)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        chat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {chat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getChatSubtitle(chat)}
                      {chat.requestId && ` • ${chat.requestId}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
              </div>
            ))}
            
            {activeChats.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">💬</div>
                <p className="text-gray-500">No active conversations</p>
                <p className="text-gray-400 text-sm mt-1">Customer and therapist chats will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {/* Chat with {getChatTitle(activeChat)} */}
                      Chat with Chris
                    
                    </h3>
                    <p className="text-sm text-gray-600">
                      {/* {getChatSubtitle(activeChat)} */}
                      {activeChat.requestId && ` • Request: ${activeChat.requestId}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeChat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activeChat.isActive ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {activeChat.messages && activeChat.messages.length > 0 ? (
                    activeChat.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === '1' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === '1'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === '1'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString('en-ZA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">💭</div>
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-gray-400 text-sm mt-1">Start the conversation</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Conversation Selected
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a conversation from the list to start messaging with customers or therapists.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common communication tasks</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              New Broadcast
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Schedule Message
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Export Chats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;