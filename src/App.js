import MainWindow from "./Components/MainWindow/MainWindow";
import "./App.css";
import Login from "./Components/Login/Login";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Auth } from "../src/Redux/Action";
import { useHistory } from "react-router-dom";
// import { Client } from "@pusher/push-notifications-web";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import useSocket from "./hooks/useSocket";
import useWorker from './hooks/useWorker'


function App() {
  const data = useSelector((state) => {
    return state;
  });
  const history = useHistory();

  useEffect(() => {
    history.push("/");
  }, []);

  useSocket();
  useWorker();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Auth(JSON.parse(localStorage.getItem("user"))));
  }, []);
  return <div className="App">{data.Auth ? <MainWindow /> : <Login />}</div>;
}

export default React.memo(() => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
});
