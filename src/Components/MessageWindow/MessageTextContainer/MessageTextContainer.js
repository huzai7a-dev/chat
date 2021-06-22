import React, { useEffect, createRef, useState } from "react";
import "./MessageTextContainer.css";
import { useDispatch, useSelector } from "react-redux";
import UserMessage from "./UserMessage/UserMessage";
import TempMsg from "./TempMessage/TempMsg";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { userMsgs } from "../../../Redux/Action";

function MessageTextContainer() {
  const RedData = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const image = RedData.chat?.elsemployees_image;
  const messageContainer = createRef();
  useEffect(() => {
    axios
      .post("/api/bwccrm/fetchMessage", {
        from_id: RedData.Auth.data?.elsemployees_empid,
        to_id: RedData.chat?.elsemployees_empid,
        user_id: RedData.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(userMsgs(res.data.messages));
      });
  }, [RedData.chat?.elsemployees_empid]);

  //function to always scroll on bottom
  const scrollToBottom = () => {
    const scroll =
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  },[RedData.userMsgs,RedData.typedMsg]);
  return (
    <div className="messageTextContainer" ref={messageContainer}>
      {RedData.userMsgs.length === 0 ? (
        <div className="noChat">
          <Avatar
            style={{ width: "120px", height: "120px" }}
            src={`/bizzportal/public/img/${image}`}
          />
          <h2>{RedData.chat?.elsemployees_name}</h2>
        </div>
      ) : (
        <div>
          {RedData.userMsgs.map((item) => {
            return <UserMessage sender={item} key={item.message_id} />;
          })}
          <div>
            {RedData.typedMsg.length !== 0
              ? RedData.typedMsg.map((typedMsgs) => {
                return <TempMsg msg={typedMsgs} key={typedMsgs.id} />;
              })
              : ""}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageTextContainer;
