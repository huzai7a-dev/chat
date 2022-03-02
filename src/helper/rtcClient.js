import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { createNewPeerConnection, getPeerConnection, setPeerConnection } from "../config/peerconnection";
import { getSocket } from "../config/socket";

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: false,
  voiceActivityDetection: false,
};

export const useRTCClient = () => {
  const localStream = useRef(null);

  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
    };
  });

  const endCall = useCallback(() => {
    const peerConnection = getPeerConnection();
    if(localStream.current){
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    localStream.current = null;
    peerConnection.close();
    createNewPeerConnection()
  }, [])

  const requestEndCall = useCallback((user_id) => {
    const socket = getSocket(auth_user.elsemployees_empid);
    endCall();
    socket.emit("request-end-call", {
      to: user_id,
      from: auth_user.elsemployees_empid,
    });
  },
  [auth_user, endCall]
);

  const callUser = useCallback(
    async (user) => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (devices.filter((d) => d.kind == "audioinput").length == 0) return alert("No Input media detected");

      console.log("Calling User", user);
      const peerConnection = getPeerConnection();
      const socket = getSocket(auth_user.elsemployees_empid);
      localStream.current = localStream.current || (await navigator.mediaDevices.getUserMedia({ audio: true }));

      const remoteVideo = document.querySelector("audio#remoteVideo");
      if (!remoteVideo) return console.log("Element missing");

      peerConnection.addEventListener("track", (e) => {
        console.log("Add Track From Peer after calling", e);
        if (remoteVideo.srcObject !== e.streams[0]) {
          remoteVideo.srcObject = e.streams[0];
          console.log("Received remote stream");
        }
      });

      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate && event.candidate.candidate) {
          console.log("Sending Ice Candidate", event.candidate);
          socket.emit("icecandidate-sent", {
            candidate: JSON.stringify(event.candidate),
            user_id: user.elsemployees_empid,
          });
        }
      });

      peerConnection.addEventListener("connectionstatechange", (event) => {
        if (peerConnection.connectionState === "connected") {
          console.log("Peer Connected", event);
        }
        if (peerConnection.connectionState === "disconnected") {
          console.log("Disconnected Peer connection", event);
          try {
            requestEndCall();
          } catch(e) {
            console.log(e)
          }
        }
      });

      localStream.current.getTracks().forEach((track) => {
        console.log("Add Track From Stream",track);
        peerConnection.addTrack(track, localStream.current);
      });

      peerConnection.addStream(localStream.current);

      const offer = await peerConnection.createOffer(offerOptions);
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      setPeerConnection(peerConnection);

      socket.emit("call-user", {
        offer,
        to: user.elsemployees_empid, // who is receiving
        from: auth_user.elsemployees_empid, // who is calling
        toUser: user,
        fromUser: auth_user,
      });
    },
    [auth_user, requestEndCall]
  );

  const acceptCall = useCallback(async (data) => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (devices.filter((d) => d.kind == "audioinput").length == 0) return alert("No Input media detected");
      console.log("Accepting the Call", data);
      const peerConnection = getPeerConnection();
      const socket = getSocket(auth_user?.elsemployees_empid);

      localStream.current = localStream.current || (await navigator.mediaDevices.getUserMedia({ audio: true }));

      const remoteVideo = document.querySelector("audio#remoteVideo");
      if (!remoteVideo) return console.log("Element missing");
      
      peerConnection.addEventListener("track", (e) => {
        console.log("Add Track From Peer after accepting", e);
        if (remoteVideo.srcObject !== e.streams[0]) {
          remoteVideo.srcObject = e.streams[0];
          console.log("Received remote stream");
        }
      });

      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate && peerConnection.localDescription?.type) {
          console.log("Sending Ice Candidate", event);
          socket.emit("icecandidate-sent", {
            candidate: JSON.stringify(event.candidate),
            user_id: data.from,
          });
        }
      });

      peerConnection.addEventListener("connectionstatechange", (event) => {
        if (peerConnection.connectionState === "connected") {
          console.log("Peer Connected", event);
          // @Todo: Set Active user details from API
          // data.from
        }
        if (peerConnection.connectionState === "disconnected") {
          console.log("Disconnected Peer connection", event);
        }
      });

      localStream.current.getTracks().forEach((track) => {
        console.log("Add Track From Stream", track);
        peerConnection.addTrack(track, localStream.current);
      });

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      socket.emit("make-answer", {
        answer,
        from: data.from, // who is calling
        to: data.to, // who is receiving
      });
      setPeerConnection(peerConnection);
    },
    [auth_user?.elsemployees_empid]
  );

  const processAfterAccept = useCallback(async (data) => {
      const peerConnection = getPeerConnection();
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      setPeerConnection(peerConnection);
    },
    []
  );

  return {
    processAfterAccept,
    callUser,
    endCall,
    requestEndCall,
    acceptCall,
  };
};
