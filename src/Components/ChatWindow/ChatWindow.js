import React, { useState } from "react";
import "./chatWindow.css";
import SearchBar from "./SearchBar/SearchBar";
import AddChat from "./AddChat/AddChat";
import ChatUserContainer from "./ChatUserContainer/ChatUserContainer";
import { DARKMAIN, } from "../../Theme/colorConstant";
import { useSelector } from "react-redux";
import SwitchTabs from "../Utils/SwitchTabs";

const ChatWindow = React.memo(() => {
  const [tabValue, setTabValue] = useState("People");
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const { isNightMode } = useSelector((store) => {
    return {
      isNightMode: store.app.mode || false,
    };
  });
  return (
    <div
      className="chat__window"
      style={{ background: isNightMode ? DARKMAIN : "#FFF" }}
    >
      <div className="chatWindow__header">
        <SearchBar />
        <AddChat />
      </div>
      <div className="switch__tabs" style={{ marginBottom: "0.5rem" }}>
        <SwitchTabs
          setTabValue={setTabValue}
          tabValue={tabValue}
          setContactsLoaded={setContactsLoaded}
          setGroupsLoaded={setGroupsLoaded}
        />
      </div>
      <ChatUserContainer
        tabValue={tabValue}
        contactsLoaded={contactsLoaded}
        groupsLoaded={groupsLoaded}
      />
    </div>
  );
});

export default React.memo(ChatWindow);
