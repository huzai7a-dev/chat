import ChatWindow from "../ChatWindow/ChatWindow";
import MessageWindow from "../MessageWindow/MessageWindow";
import Welcome from "../Welcome/Welcome";
import "./Main.css";
import GroupMessageWindow from "../GroupMessageWindow/GroupMessageWindow";
import { Route, Switch } from "react-router-dom";
import { DARKMAIN } from "../../Theme/colorConstant";
import { useSelector } from "react-redux";
import AdminPanel from "../AdminPanel/AdminPanel";


const Main = React.memo(() => {
  const {isNightMode,adminPanel } = useSelector((store) => {
    return {
      isNightMode:store.app.mode || false,
      adminPanel:store.app.adminPanel || false,
    }
  });
  return (
    <div className="main__window" style={{background:isNightMode ? DARKMAIN : "#fff"}}>
     
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
