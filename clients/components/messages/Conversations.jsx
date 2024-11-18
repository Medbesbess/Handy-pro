// Conversations.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

function Conversations({ setCurrentChat }) {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const currentUserRole = localStorage.getItem('role');
  const isProvider = currentUserRole === 'provider';

  const getConversations = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/conversations/${userId}/Allconversations`
      );
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    getConversations();
  }, []);

  const getChatPartnerInfo = (conversation) => {
    if (isProvider) {
      return {
        photo: conversation.User?.photoUrl,
        name: conversation.User?.username,
      };
    } else {
      return {
        photo: conversation.provider?.photoUrl,
        name: conversation.provider?.username,
      };
    }
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    
    try {
      if (value.trim()) {
        const userId = localStorage.getItem("userId");
        const { data } = await axios.get(
          `http://localhost:3001/api/conversations/search?${
            isProvider ? 'username' : 'providerName'
          }=${value}&userId=${userId}`
        );
        setConversations(data);
      } else {
        // Si la recherche est vide, recharger toutes les conversations
        getConversations();
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Utilisé uniquement pour l'affichage des conversations
  const displayedConversations = conversations;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1034A6]">HandyPro Chat</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-3 h-5 w-5 ${
            isSearching ? 'text-[#FF8A00]' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder={`Search ${isProvider ? 'users' : 'providers'}`}
            className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] transition-all duration-200"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Recent Chats - Toujours visible sauf si pas de conversations */}
      {displayedConversations.length > 0 && (
        <div className="p-4 border-b">
          <h2 className="text-xs font-semibold text-gray-500 mb-3">RECENT CHATS</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {displayedConversations.map((conversation, index) => {
              const partnerInfo = getChatPartnerInfo(conversation);
              return (
                <div key={index} className="flex-shrink-0">
                  <div className="relative group cursor-pointer"
                       onClick={() => setCurrentChat(conversation)}>
                    <img
                      src={partnerInfo.photo}
                      alt={partnerInfo.name}
                      className="w-14 h-14 rounded-full border-2 border-[#FF8A00] p-0.5 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-600">
                    {partnerInfo.name?.split(' ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {displayedConversations.map((conversation, index) => {
          const partnerInfo = getChatPartnerInfo(conversation);
          return (
            <div
              key={index}
              onClick={() => setCurrentChat(conversation)}
              className="px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={partnerInfo.photo}
                  alt={partnerInfo.name}
                  className="w-12 h-12 rounded-full border-2 border-transparent hover:border-[#FF8A00] transition-colors duration-200"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {partnerInfo.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.messages?.[0]?.createdAt ? 
                      new Date(conversation.messages[0].createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : ''
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.messages?.[0]?.content || "Start a conversation"}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-[#FF8A00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty State - Only shown when no conversations match */}
        {displayedConversations.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm ? "No matches found" : "No conversations yet"}
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm 
                  ? `No ${isProvider ? 'users' : 'providers'} found matching "${searchTerm}"`
                  : `Start chatting with ${isProvider ? 'users' : 'providers'} by visiting their profiles`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversations;