import React from "react";
import User from "./User/User";
import "./chatWindow.css";
import SearchBar from "./SearchBar/SearchBar";
import AddChat from "./AddChat/AddChat";
import ChatUserContainer from "./ChatUserContainer/ChatUserContainer";

function ChatWindow() {
  return (
    <div className="chat__window">
      <div className="chatWindow__header">
        <User />
        <SearchBar />
        <AddChat />
      </div>
      <ChatUserContainer />
    </div>
  );
}

export default ChatWindow;
