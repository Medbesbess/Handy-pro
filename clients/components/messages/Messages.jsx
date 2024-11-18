// Messages.jsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { 
  MoreVertical, 
  SendHorizontal,
  SmilePlus,
  Paperclip,
  Phone,
  Video,
  Image as ImageIcon,
  X
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import logo from "../../assets/images/HandyPro.png";

const Messages = ({ currentChat }) => {
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const currentUserRole = localStorage.getItem('role');
  const isProvider = currentUserRole === 'provider';

  useEffect(() => {
    if (!currentChat?.id) return;

    const markMessagesAsRead = async () => {
      const role = localStorage.getItem('role');
      try {
        await axios.put(
          `http://localhost:3001/api/conversations/${currentChat.id}/read?role=${role}`
        );
        // Émettre un événement pour mettre à jour le compteur dans la navbar
        socketRef.current?.emit('messagesRead', {
          conversationId: currentChat.id,
          role: role
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();
  }, [currentChat?.id]);
  // Helper function to get chat partner info
  const getChatPartnerInfo = () => {
    if (isProvider) {
      return {
        photo: currentChat.User?.photoUrl,
        name: currentChat.User?.username,
      };
    } else {
      return {
        photo: currentChat.provider?.photoUrl,
        name: currentChat.provider?.username,
      };
    }
  };

  // Helper function to get current user's photo
  const getCurrentUserPhoto = () => {
    if (isProvider) {
      return currentChat.provider?.photoUrl;
    } else {
      return currentChat.User?.photoUrl;
    }
  };

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Socket connection
  useEffect(() => {
    if (!currentChat?.id) return;

    socketRef.current = io('http://localhost:3001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('joinConversation', currentChat.id);
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentChat?.id]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat?.id) return;
      
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/conversations/${currentChat.id}/messages`
        );
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentChat?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle emoji selection
  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  // Handle text message submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected || !currentChat?.id) return;

    try {
      const messageSocket = {
        conversationId: currentChat.id,
        sender: currentUserRole,
        createdAt: new Date().toISOString(),
        content: newMessage.trim(),
      };

      socketRef.current.emit('sendMessage', messageSocket);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      
      // Upload to Cloudinary
      const formDataImage = new FormData();
      formDataImage.append('file', file);
      formDataImage.append('upload_preset', 'ml_default2');

      const uploadRes = await fetch(
        'https://api.cloudinary.com/v1_1/dlg8j6m69/image/upload',
        {
          method: 'POST',
          body: formDataImage
        }
      );

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image');
      }

      const imageData = await uploadRes.json();
      const imageUrl = imageData.secure_url;

      // Send message with image URL
      const messageSocket = {
        conversationId: currentChat.id,
        sender: currentUserRole,
        createdAt: new Date().toISOString(),
        content: imageUrl,
      };

      socketRef.current.emit('sendMessage', messageSocket);
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Check if content is an image URL
  const isImageUrl = (content) => {
    return content.match(/\.(jpeg|jpg|gif|png)$/) != null || 
           content.includes('cloudinary.com');
  };

  const chatPartner = getChatPartnerInfo();

  return (
    <div className="h-screen flex flex-col relative">
      {/* Watermark Logo */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: '50% auto',
          opacity: 1,
          mixBlendMode: 'multiply'
        }}
      />

      <div className="relative z-10 flex flex-col h-full bg-gray-300/80">
        {/* Chat Header */}
        {currentChat?.id ? (
          <div className="p-4 border-b bg-blue-700 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <img
                    src={chatPartner.photo}
                    alt={chatPartner.name}
                    className="w-12 h-12 rounded-full border-2 border-[#FF9202] p-0.5 transition-transform duration-300 group-hover:scale-105"
                  />
                  
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[#FF9202]">
                    {chatPartner.name}
                  </h2>
                 
                </div>
              </div>
              
             
            </div>
          </div>
        ) : null}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.sender === currentUserRole;
            const isImage = isImageUrl(message.content);

            return (
              <div
                key={index}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2 animate-fade-in`}
              >
                {!isOwn && (
                  <img
                    src={chatPartner.photo}
                    alt={chatPartner.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                )}
                <div
                  className={`${
                    isOwn
                      ? 'bg-gradient-to-r from-[#1034A6] to-[#1034A6]/90 text-white rounded-t-2xl rounded-l-2xl'
                      : 'bg-white text-gray-800 rounded-t-2xl rounded-r-2xl shadow-md'
                  } ${isImage ? 'p-1' : 'p-4'} transition-all duration-300 hover:shadow-lg max-w-[300px]`}
                >
                  {isImage ? (
                    <div className="relative group">
                      <img 
                        src={message.content}
                        alt="Shared content"
                        className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.content, '_blank')}
                      />
                      <span className={`text-xs ${isOwn ? 'text-white' : 'text-gray-500'} absolute bottom-1 right-2`}>
                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
                        {new Date(message.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </>
                  )}
                </div>
                {isOwn && (
                  <img
                    src={getCurrentUserPhoto()}
                    alt="You"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/90 border-t backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto relative">
            <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-xl shadow-sm">
              <div className="relative">
                <button 
                  type="button" 
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    showEmojiPicker ? 'bg-gray-200' : 'hover:bg-white'
                  }`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <SmilePlus className="h-6 w-6 text-[#FF8A00]" />
                </button>
                
                {showEmojiPicker && (
                  <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-12 left-0 z-50"
                  >
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="absolute -right-2 -top-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-50"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        theme="light"
                        width={300}
                        height={400}
                        searchPlaceHolder="Search emoji..."
                        skinTonesDisabled
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-700 placeholder-gray-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!isConnected || isUploading}
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
                {isUploading ? (
                  <div className="p-2">
                    <div className="w-6 h-6 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin"/>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="p-2 hover:bg-white rounded-full transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-6 w-6 text-[#FF8A00]" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!isConnected || !newMessage.trim() || isUploading}
                  className="p-3 bg-gradient-to-r from-[#FF8A00] to-[#FF8A00]/90 rounded-full text-white hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                   <SendHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;