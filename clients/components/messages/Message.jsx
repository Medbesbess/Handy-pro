// Message.jsx
import "./message.css";
import React from "react";
import moment from 'moment';

function Message({message, profileDoc, profilePat}) {
  const role = localStorage.getItem("role");
  const isOwn = message.sender === role;

  return (
    <div style={{paddingTop: "96px"}} className={isOwn ? "message own" : "message"}>
      {!isOwn ? (
        <div className="messageTop">
          <img
            className="messageImg"
            src={role === "provider" ? profilePat : profileDoc}
            alt=""
          />
          <p className="messageText">{message.content}</p>
        </div>
      ) : (
        <div className="messageTop">
          <p className="messageText">{message.content}</p>
          <img
            className="messageImg"
            src={role === "provider" ? profileDoc : profilePat}
            alt=""
          />
        </div>
      )}
      <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
    </div>
  );
}

export default Message;