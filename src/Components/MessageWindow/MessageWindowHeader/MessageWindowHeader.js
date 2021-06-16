import React from "react";
import "./messageWindowHeader.css";
import { useSelector } from "react-redux";

function MessageWindowHeader() {
  const data = useSelector((state) => {
    return state;
  });

  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2>{data.chat?.elsemployees_name}</h2>
      </div>
      {/* <div className="userStatus">
        <div className={data.chat.user_loginstatus ? "onlineStatus" : ""}></div>
        <p>{data.chat.user_loginstatus}</p>
      </div> */}
    </div>
  );
}

export default MessageWindowHeader;
