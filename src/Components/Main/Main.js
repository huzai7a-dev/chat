import React, { useEffect, useRef, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import MessageWindow from "../../Views/MessageWindow/MessageWindow";
import Welcome from "../../Views/Welcome/Welcome";
import GroupMessageWindow from "../../Views/GroupMessageWindow/GroupMessageWindow";
import { DARKMAIN } from "../../Theme/colorConstant";
import AdminPanel from "../AdminPanel/AdminPanel";
import AppLayout from "../AppLayout/AppLayout";
import "./Main.css";

const Main = React.memo(() => {
  const dispatch = useDispatch();
  const { isNightMode, adminPanel, auth_user, active_user, onCall } =
    useSelector((store) => {
      return {
        active_user: store.chat.active_user || {},
        auth_user: store.auth.auth_user || {},
        isNightMode: store.app.mode || false,
        adminPanel: store.app.adminPanel || false,
        onCall: store.chat?.call || {},
      };
    });

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
    </div>
  );
});

export default Main;
