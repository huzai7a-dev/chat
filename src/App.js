import React, { useMemo } from "react";
import "./App.css";
import Main from "./Components/Main/Main";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../src/Redux/actions/auth";
import { useHistory } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import useSocket from "./hooks/useSocket";
import useWorker from "./hooks/useWorker";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { lightTheme } from "./Theme/customTheme";
import Modal from "react-modal";
import { getContactsTotal } from "./api/message";
import Auth from "./Components/Auth/Auth";
import { setNightMode } from "./Redux/actions/app";
import useCalling from "./hooks/useCalling";

Modal.setAppElement("#root");
const App = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user,
    };
  });

  useEffect(() => {
    const auth_user = JSON.parse(localStorage.getItem("user"));
    if (auth_user && auth_user.data) {
      return localStorage.removeItem("user");
    }
    dispatch(setAuthUser(auth_user));
    history.push("/");
  }, [dispatch, history]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    dispatch(setNightMode(theme == "dark"));
  }, [dispatch]);

  useWorker();
  useSocket();

  const { renderOnCall, renderIncomingAlert, renderOngoingCall } = useCalling();

  useEffect(() => {
    const params = {
      data: {
        campaign_id: 1,
        user_id: auth_user?.elsemployees_empid || 1,
      },
    };
    dispatch(getContactsTotal(params));
  }, [auth_user?.elsemployees_empid, dispatch]);

  const renderApp = useMemo(() => {
    if(auth_user) {
      return <Main key={auth_user.elsemployees_empid}/>
    }
    return <Auth />
  }, [auth_user])

  return (
    <div className="App">
      {renderApp}
      {renderOnCall}
      {renderOngoingCall}
      {renderIncomingAlert}
    </div>
  );
};

export default () => {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={lightTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
};
