import React, { useEffect, createRef, useState } from "react";
import "./MessageTextContainer.css";
import UserMessage from "./UserMessage/UserMessage";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { groupMemberInfo, groupMsgs } from "../../../Redux/Action";
import { Avatar } from "@material-ui/core";
import TempMsg from "./TempMessage/TempMsg";
import Alert from "@material-ui/lab/Alert";
function MessageTextContainer() {
  const data = useSelector((state) => {
    return state;
  });

  const dispatch = useDispatch();
  const img = data.groupChat?.group_image;
  const messageContainer = createRef();
  const [alertMessage, setalertMessage] = useState(false);
  useEffect(() => {
    axios
      .post("/api/bwccrm/fetchMessageGroup", {
        group_id: data.groupChat?.group_id,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(groupMsgs(res.data.messages));
      });
  }, [data.groupChat?.group_id]);
  const MemberAlert = () => {
    return (
      <Alert
        severity="info"
        style={{
          position: "fixed",
          left: "50%",
          textAlign: "center",
        }}
      >
        {data.groupMemberInfo.member_name} has been {data.groupMemberInfo.event}
      </Alert>
    );
  };
  useEffect(() => {
    const hasObj = Object.keys(data.groupMemberInfo).length;
    if (hasObj > 0) {
      setalertMessage(true);
      setTimeout(function () {
        setalertMessage(false);
        dispatch(groupMemberInfo({}));
      }, 3000);
    }
  }, [data.groupMemberInfo]);
  //function to always scroll on bottom
  const scrollToBottom = () => {
    const scroll =
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  }, [data.groupMsgs, data.typedMsg]);
  return (
    <div className="messageTextContainer" ref={messageContainer}>
      {alertMessage ? MemberAlert() : null}
      {data.groupMsgs.length === 0 ? (
        <div className="noChat">
          <Avatar
            style={{ width: "120px", height: "120px" }}
            src={`/api/bwccrm/storage/app/public/chat_attachments/${img}`}
          />
          <h2>Welcome To {`${data.groupChat?.group_name}'s`} Group</h2>
        </div>
      ) : (
        <div>
          {data.groupMsgs.map((item) => {
            return <UserMessage chatgroup={item} key={item.message_id} />;
          })}
          <div>
            {data.typedMsg.length !== 0
              ? data.typedMsg.map((typedMsgs) => {
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
