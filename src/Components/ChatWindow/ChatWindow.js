import React from "react";
import User from "./User/User";
import "./chatWindow.css";
import SearchBar from "./SearchBar/SearchBar";
import AddChat from "./AddChat/AddChat";
import ChatUserContainer from "./ChatUserContainer/ChatUserContainer";
import { DARKMAIN } from "../../Theme/colorConstant";
import { useSelector } from "react-redux";

const ChatWindow = React.memo(() => {
  const {isNightMode } = useSelector((store) => {
    return {
      isNightMode:store.app.mode || false
    }
  });
  return (
    <div className="chat__window" style={{background: isNightMode ? DARKMAIN: "#fff"}}>
      <div className="chatWindow__header">
        <User />
        <SearchBar />
        <AddChat />
      </div>
      <ChatUserContainer />
    </div>
  );
});

export default ChatWindow;
