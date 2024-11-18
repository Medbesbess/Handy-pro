// Messenger.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Conversations from "./Conversations";
import Messages from "./Messages";
import ProviderNavBar from "../serviceProvider/ProviderNavBar";
import Navbar from "../Homepage/Navbar";

function Messenger() {
  const location = useLocation();
  const [currentChat, setCurrentChat] = useState({ id: 0 });
  const userRole = localStorage.getItem('role');
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (location.state?.currentChat) {
      setCurrentChat(location.state.currentChat);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Dynamic Navbar */}
      <div className="w-full">
        {userRole === 'provider' ? (
          <ProviderNavBar />
        ) : (
          <Navbar onCategorySelect={() => {}} />
        )}
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 mx-4 mt-4 mb-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Conversations Sidebar */}
        <div className={`
          md:w-80 border-gray-200 flex-shrink-0
          ${currentChat.id === 0 ? 'w-full' : 'hidden md:block'}
          ${isMobileView ? 'border-b' : 'border-r'}
        `}>
          <Conversations 
            setCurrentChat={(chat) => {
              setCurrentChat(chat);
              setIsMobileView(true);
            }} 
          />
        </div>

        {/* Messages Area */}
        <div className={`
          flex-1
          ${currentChat.id === 0 ? 'hidden md:block' : 'block'}
        `}>
          <div className="h-full relative">
            {currentChat.id !== 0 && (
              <button
                onClick={() => setCurrentChat({ id: 0 })}
                className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                ←
              </button>
            )}
            <Messages currentChat={currentChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;