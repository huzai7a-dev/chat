import React, { useEffect, useRef, useState } from "react";
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
import OnAnswer from "../../Call/OnAnswer";
import { useCalling } from "../../../hooks/useCalling";


let Peer;

if (typeof navigator !== "undefined") {
   Peer = require("peerjs").default
}
function MessageWindowHeader() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteAudioRef = useRef(null);
  const currentUserAudioRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserAudioRef.current.srcObject = mediaStream;
        currentUserAudioRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteAudioRef.current.srcObject = remoteStream
          remoteAudioRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {

      currentUserAudioRef.current.srcObject = mediaStream;
      currentUserAudioRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream
        remoteAudioRef.current.play();
      });
    });
  }
  // const { active_user, isNightMode, auth_user } = useSelector((store) => {
  //   return {
  //     active_user: store.chat.active_user || {},
  //     isNightMode: store.app.mode || false,
  //     auth_user: store.auth.auth_user || {},
  //   };
  // });

  // // const call = useCalling();
  // const [openCall, setOpenCall] = React.useState(false);
  // const [play, { stop }] = useSound(skypeSound);
  // const dispatch = useDispatch();
  // const openGallery = () => {
  //   dispatch(setGallery(true));
  //   const params = {
  //     data: {
  //       user_id: auth_user?.elsemployees_empid,
  //       from_id: auth_user?.elsemployees_empid,
  //       to_id: active_user?.elsemployees_empid,
  //     },
  //   };
  //   dispatch(getUserAttachments(params));
  // };

  // const onStartCall = () => {
  //   //  setOpenCall(true);
  //   //  play();
  // };
  // const endCall = () => {
  //   // setOpenCall(false);
  //   // stop();
  // };
  
  return (
    <div className="MessageWindowHeader">
      <h5>Current user id is {peerId}</h5>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <audio ref={currentUserAudioRef} />
      </div>
      <div>
        <audio ref={remoteAudioRef} />
      </div>
      {/* <div className="userName">
        <h2 style={{ color: isNightMode ? "#fff" : "#000" }}>
          {active_user?.elsemployees_name}
        </h2>
        <div onClick={openGallery}>
          <Typography variant="body2">Gallery</Typography>
        </div>
      </div>
      <div>
        <Tooltip title="Make a call">
          <IconButton onClick={onStartCall}>
            <CallIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div>
      <Modal
        open={openCall}
        onClose={() => setOpenCall(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {/* <OnAnswer/> */}
        {/* <OnCall callTo={active_user?.elsemployees_name} endCall={endCall} />
      </Modal> */} 
    </div>
  );
}

export default MessageWindowHeader;
