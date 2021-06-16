import ChatWindow from "../ChatWindow/ChatWindow";
import MessageWindow from "../MessageWindow/MessageWindow";
import Welcome from "../Welcome/Welcome";
import "./MainWindow.css";

import GroupMessageWindow from "../GroupMessageWindow/GroupMessageWindow";
import { Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { groupMsgs, updateGroup, upDateUser, userMsgs } from "../../Redux/Action";
import axios from "axios";
function MainWindow() {
  const dispatch = useDispatch();
  const RdxData = useSelector((state) => {
    return state;
  });
  // pusher for real time
  // useEffect(() => {
  //   Pusher.logToConsole = true
  //   const pusher = new Pusher("f30ce11a6ce537110adc", {
  //     cluster: "ap2",
  //     encrypted: true,
  //   });
  //   const channel = pusher.subscribe(`bwccrm-chat30${RdxData.Auth.data?.elsemployees_empid}`);
  //   channel.bind(`messaging`, (data) => {
  //     const pusherRes = {
  //       message_attachment: data.message.message.message_attachment,
  //       message_body: data.message.message.message_body,
  //       from_userpicture: data.message.message.user_picture,
  //       message_from: data.message.message.message_from,
  //       message_originalname: data.message.message.message_from_name,
  //       message_from_name: data.message.message.message_from_name,
  //       fullTime: data.message.message.message_fullTime,
  //       message_id: data.message.message.message_id,
  //       group_id: data.message.message.group_id,
  //       groupmessage_body: data.message.message.message_body,
  //       groupmessage_attachment: data.message.message.message_attachment,
  //       from_userid: data.user?.elsemployees_empid,
  //       message_quotebody:data.message.message.message_quotebody,
  //       message_quoteid:data.message.message.message_quoteid,
  //       message_quoteuser:data.message.message.message_quoteuser,
  //       groupmessage_quotebody:data.message.message.groupmessage_quotebody,
  //       groupmessage_quoteid:data.message.message.groupmessage_quoteid,
  //       groupmessage_quoteuser:data.message.message.groupmessage_quoteuser
  //     };
  //     if (data.message.message.message_from) { // condtion when messages comes user list will be updated
  //       axios
  //         .post("/api/bwccrm/getContactsUser", {
  //           loginuser_id: RdxData.Auth.data?.elsemployees_empid,
  //           user_id: RdxData.Auth.data?.elsemployees_empid,
  //         })
  //         .then((res) => {
  //           dispatch(upDateUser(res.data.contacts));
  //         });
  //     } else { // condtion when messages comes group list will be updated
  //       axios
  //         .post("/api/bwccrm/getUserGroups", {
  //           loginuser_id: RdxData.Auth.data?.elsemployees_empid,
  //           user_id: RdxData.Auth.data?.elsemployees_empid,
  //         })
  //         .then((res) => {
  //           dispatch(updateGroup(res.data));
  //         })
  //         .catch((err) => {
  //           console.warn("group error", err);
  //         });
  //     }
  //     if (RdxData.chat?.elsemployees_empid === data.message.message.message_from) {
  //       dispatch(userMsgs([...RdxData.userMsgs, pusherRes]));
  //     }
  //     if (RdxData.groupChat?.group_id === data.message.message.group_id) {
  //       dispatch(groupMsgs([...RdxData.groupMsgs, pusherRes]));
  //     }
  //   });
  //   return () => {
  //     pusher.unsubscribe(`bwccrm-chat30`);
  //   };
  // }, [RdxData.chat, RdxData.userMsgs, RdxData.groupMsgs, RdxData.groupChat]);

  return (
    <div className="main__window">
      <ChatWindow />
      <Switch>
        <Route path="/" component={Welcome} exact />
        <Route path="/user" component={MessageWindow} exact />
        <Route path="/group" component={GroupMessageWindow} exact />
      </Switch>
    </div>
  );
}

export default MainWindow;
