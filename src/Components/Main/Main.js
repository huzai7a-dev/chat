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
import OnCalling from "../Call/OnCalling";
import { setOnCallComing } from "../../Redux/actions/chat";
import { getSocket } from "../../config/socket";
import { setCallerInfo, setCallingInfo } from "../../Redux/actions/app";
import { getPeerConnection } from "../../config/peerconnection";

const Main = React.memo(() => {
  const dispatch = useDispatch();
  const videoRef = useRef();
  const { isNightMode, adminPanel, auth_user, active_user, onCall, callerInfo, remoteStream } =
    useSelector((store) => {
      return {
        active_user: store.chat.active_user || {},
        auth_user: store.auth.auth_user || {},
        isNightMode: store.app.mode || false,
        adminPanel: store.app.adminPanel || false,
        onCall: store.chat?.call || {},
        callerInfo: store.app.callerInfo,
        remoteStream : store.app.remoteStream,
      };
    });

  const onCallReject = () => {
    const socketData = {
      user_id: active_user?.elsemployees_empid,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("rejectCall", socketData);
    dispatch(
      setOnCallComing({
        ...onCall,
        isCalling: false,
      })
    );
    dispatch(setCallerInfo({}))
  };

  useEffect(() => {
    if(videoRef.current && remoteStream) {
      console.log("Playing Audio",remoteStream)
      videoRef.current.srcObject = remoteStream;
      videoRef.current.play()
    }
  }, [remoteStream])

  return (
    <div
      className="main__window"
      style={{ background: isNightMode ? DARKMAIN : "#fff" }}
    >
      {/* receiving model  */}
      <Modal
        open={Object.keys(callerInfo).length > 0}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        
        <ToReceiveCall
          handleReject={onCallReject}
          from={onCall?.callFrom}
        />
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
