import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import MessageWindow from "../../Views/MessageWindow/MessageWindow";
import Welcome from "../../Views/Welcome/Welcome";
import GroupMessageWindow from "../../Views/GroupMessageWindow/GroupMessageWindow";
import { DARKMAIN } from "../../Theme/colorConstant";
import AdminPanel from "../AdminPanel/AdminPanel";
import AppLayout from "../AppLayout/AppLayout";
import "./Main.css";
import GalleryModal from "../GalleryModal/GalleryModal";

const Main = React.memo(() => {
  const videoRef = useRef();
  const { isNightMode, remoteStream } =
    useSelector((store) => {
      return {
        isNightMode: store.app.mode || false,
        remoteStream : store.app.remoteStream,
      };
    });

  useEffect(() => {
    if(videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
      videoRef.current.play()
    }
  }, [remoteStream])

  return (
    <div
      className="main__window"
      style={{ background: isNightMode ? DARKMAIN : "#fff" }}
    >
      <Switch>
        <Route path="/admin" component={AdminPanel} />
        <AppLayout>
          <Route path="/" component={Welcome} exact />
          <Route path="/user/:id" component={MessageWindow} />
          <Route path="/group/:id" component={GroupMessageWindow} />
        </AppLayout>
      </Switch>
      <GalleryModal />
    </div>
  );
});

export default Main;
