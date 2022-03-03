import React, { useState } from "react";
import "./messageWindowHeader.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Modal,
  Backdrop,
} from "@material-ui/core";
import OnCall from "../../Call/OnCall";
// import { getSocket } from "../../../socket";
import { setMakeCall } from "../../../Redux/actions/chat";
import { getSocket } from "../../../config/socket";
import { WHITE } from "../../../Theme/colorConstant";
// const Peer = require('peerjs');

function MessageWindowHeader(props) {
  const [openCall, setOpenCall] = useState(false);
  const { active_user, isNightMode, auth_user, makeCall } = useSelector(
    (store) => {
      return {
        active_user: store.chat.active_user || {},
        isNightMode: store.app.mode || false,
        auth_user: store.auth.auth_user || {},
        makeCall: store.chat?.makeCall || false,
      };
    }
  );

  const dispatch = useDispatch();
    const openGallery = ()=>{
      history.replace(`${location.pathname}#gallery`)
    }

  const onEndCall = () => {
    const socketData = {
      user_id: active_user?.elsemployees_empid,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("endCall", socketData);
    dispatch(setMakeCall(false));
    // stop();
  };

  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2 style={{ color: isNightMode ? WHITE : "#000" }}>
          {active_user?.elsemployees_name}
        </h2>
        <div onClick={openGallery}>
          <Typography variant="body2" style={{color: WHITE}}>Gallery</Typography>
        </div>
      </div>
      <Modal
        open={makeCall}
        onClose={() => setOpenCall(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <OnCall callTo={active_user?.elsemployees_name} endCall={onEndCall} />
      </Modal>
    </div>
  );
}

export default MessageWindowHeader;
