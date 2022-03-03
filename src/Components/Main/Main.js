import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import MessageWindow from "../../Views/MessageWindow/MessageWindow";
import Welcome from "../../Views/Welcome/Welcome";
import GroupMessageWindow from "../../Views/GroupMessageWindow/GroupMessageWindow";
import { BLACK, WHITE } from "../../Theme/colorConstant";
import AdminPanel from "../AdminPanel/AdminPanel";
import AppLayout from "../AppLayout/AppLayout";
import "./Main.css";
import GalleryModal from "../GalleryModal/GalleryModal";

const Main = React.memo(() => {
  const { isNightMode, } =
    useSelector((store) => {
      return {
        isNightMode: store.app.mode || false,
      };
    });

  return (
    <div
      className="main__window"
      style={{ background: isNightMode ? BLACK : WHITE }}
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
