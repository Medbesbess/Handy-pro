// Conversation.jsx
import React from 'react'
import "./conversation.css"
function Conversation({conversation}) {
  
  return (
    <div className='Conversation' >
        
        <img className='conversationImg' src={conversation.user?.photoUrl} alt="" />
        <span className='conversationName'>{conversation.user?.username}</span>
        
    </div>
  )
}

export default Conversation