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
import { setIsCallComing } from "../../Redux/actions/chat";

const Main = React.memo(() => {
  const dispatch = useDispatch();
  const { isNightMode, adminPanel, isCallComing } = useSelector((store) => {
    return {
      isNightMode: store.app.mode || false,
      adminPanel: store.app.adminPanel || false,
      isCallComing: store.chat.calling || false,
    };
  });
  const onReject = () => {
    dispatch(setIsCallComing(false));
  };
  return (
    <div
      className="main__window"
      style={{ background: isNightMode ? DARKMAIN : "#fff" }}
    >
      {/* receiving model  */}
      <Modal
        open={isCallComing}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <ToReceiveCall handleReject={onReject} />
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
