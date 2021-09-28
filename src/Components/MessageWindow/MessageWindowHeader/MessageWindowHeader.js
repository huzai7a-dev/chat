import React from "react";
import "./messageWindowHeader.css";
import { useSelector } from "react-redux";
import { IconButton } from "@material-ui/core";
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
function MessageWindowHeader() {
  
  const { active_user,isNightMode } = useSelector((store) => {
    return {
      active_user: store.chat.active_user || {},
      isNightMode:store.app.mode || false
    }
  });

  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2 style={{color: isNightMode ? "#fff": "#000"}}>{active_user?.elsemployees_name}</h2>
      </div>
      
    </div>
  );
}

export default MessageWindowHeader;
