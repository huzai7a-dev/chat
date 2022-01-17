import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import "./messageWindowHeader.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Backdrop,
} from "@material-ui/core";
import skypeSound from "../../../Assets/sound/skype-ringing.mp3";
import CallIcon from "@material-ui/icons/Call";
import { getUserAttachments } from "../../../api/message";
import { setGallery } from "../../../Redux/actions/message";
import OnCall from "../../Call/OnCall";
// import { getSocket } from "../../../socket";
import { setMakeCall } from "../../../Redux/actions/chat";
import { getSocket } from "../../../config/socket";
// const Peer = require('peerjs');
function MessageWindowHeader() {
  const [openCall, setOpenCall] = useState(false);
  const [myCallId, setMyCallId] = useState("");
  const [stream, setStream] = useState("");
  const [play, { stop }] = useSound(skypeSound);
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
  useEffect(() => {
    const peer = new window.Peer();
    peer.on("open", (id) => {
      setMyCallId(id);
    });
  }, []);
  const dispatch = useDispatch();
  const openGallery = () => {
    dispatch(setGallery(true));
    const params = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
      },
    };
    dispatch(getUserAttachments(params));
  };

  const onStartCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
    const socketData = {
      user_id: active_user?.elsemployees_empid,
      userName: auth_user?.elsemployees_name,
      userCallId: myCallId,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("startCall", socketData);
    dispatch(setMakeCall(true));
    //  play();
  };
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
        <h2 style={{ color: isNightMode ? "#fff" : "#000" }}>
          {active_user?.elsemployees_name}
        </h2>
        <div onClick={openGallery}>
          <Typography variant="body2">Gallery</Typography>
        </div>
      </div>
      {/* <div>
        <Tooltip title="Make a call">
          <IconButton onClick={onStartCall}>
            <CallIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div> */}

      {/* calling model */}
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
