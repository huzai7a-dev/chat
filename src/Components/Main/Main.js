import React, { useEffect, useRef, useState } from "react";
import ChatWindow from "../ChatWindow/ChatWindow";
import MessageWindow from "../MessageWindow/MessageWindow";
import Welcome from "../Welcome/Welcome";
import "./Main.css";
import GroupMessageWindow from "../GroupMessageWindow/GroupMessageWindow";
import { Route, Switch } from "react-router-dom";
import { DARKMAIN } from "../../Theme/colorConstant";
import { useSelector, useDispatch } from "react-redux";
import AdminPanel from "../AdminPanel/AdminPanel";
import { Backdrop, Modal } from "@material-ui/core";
import ToReceiveCall from "../Call/ToReceiveCall";
import { setOnCallComing } from "../../Redux/actions/chat";
import { getSocket } from "../../socket";

const Main = React.memo(() => {
  const dispatch = useDispatch();
  const { isNightMode, adminPanel,auth_user,active_user, onCall } = useSelector((store) => {
    return {
      active_user: store.chat.active_user || {},
      auth_user: store.auth.auth_user || {},
      isNightMode: store.app.mode || false,
      adminPanel: store.app.adminPanel || false,
      onCall: store.chat?.call || {},
    };
  });
  const onReject = () => {
    const socketData = {
      user_id:active_user?.elsemployees_empid,
    }
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("rejectCall", socketData);
    dispatch(setOnCallComing({
      ...onCall,
      isComing:false
    }));
  };

  return (
    <div
      className="main__window"
      style={{ background: isNightMode ? DARKMAIN : "#fff" }}
    >
      {/* receiving model  */}
      <Modal
        open={onCall?.isCalling}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ToReceiveCall handleReject={onReject} from={onCall?.callFrom} />
      </Modal>
      {!adminPanel && <ChatWindow />}
      <Switch>
        <Route path="/" component={Welcome} exact />
        <Route path="/user/:id" component={MessageWindow} />
        <Route path="/group/:id" component={GroupMessageWindow} />
        <Route path="/admin" component={AdminPanel} />
      </Switch>
    </div>
  );
});

export default Main;
