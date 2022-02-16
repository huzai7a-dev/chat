import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCallerInfo,
  setCallingInfo,
  setRemoteStream,
  setLocalStream,
} from "../Redux/actions/app";
import { getPeerConnection } from '../config/peerconnection';
import { getSocket } from "../config/socket";

export const useRTCClient = () => {
  const dispatch = useDispatch();
  const { reduxLocalStream, reduxRemoteStream } = useSelector(store => {
    return {
      reduxLocalStream: store.app.localStream,
      reduxRemoteStream: store.app.remoteStream,
    }
  })
  const remoteStream = useRef(reduxRemoteStream);
  const localStream = useRef(reduxLocalStream);
  const localTrack = useRef();

  const { auth_user, callerInfo } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
      callerInfo: store.app.callerInfo || {},
    };
  });

  const callUser = useCallback(async (user_id) => {

    const devices = await navigator.mediaDevices.enumerateDevices()
    if (devices.filter(d => d.kind == "audioinput").length == 0) return alert("No Input media detected"); 
    console.log("Calling User", user_id)
    const peerConnection = getPeerConnection();
    const socket = getSocket(auth_user.elsemployees_empid);
    remoteStream.current = remoteStream.current || new MediaStream();
    localStream.current = localStream.current || await navigator.mediaDevices.getUserMedia({ audio: true });
    const remoteVideo = document.querySelector('#remoteVideo');
    remoteVideo.srcObject = remoteStream.current;
    remoteVideo.play();

    peerConnection.addEventListener("track", (e) => {
      console.log("Add Track From Peer", e);
      remoteStream.current?.addTrack(e.track, remoteStream.current);
    });
    
    localStream.current.getTracks().forEach((track) => {
      console.log("Add Track From Stream", track, peerConnection, localStream.current);
      localTrack.current = track;
      peerConnection.addTrack(track, localStream.current);
    });
    
    peerConnection.addStream(localStream.current)
    
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("call-user", {
      offer,
      to: user_id, // who is receiving
      from: auth_user.elsemployees_empid, // who is calling
    });
    // setPeerConnection(peerConnection)
    dispatch(setRemoteStream(remoteStream.current))
    dispatch(setLocalStream(localStream.current))
  }, [auth_user, dispatch]);

  const endCall = useCallback((user_id) => {
    const socket = getSocket(auth_user.elsemployees_empid);
    remoteStream.current = new MediaStream();
    dispatch(setRemoteStream(remoteStream.current))
    socket.emit('request-end-call', {
      to: user_id,
      from: auth_user.elsemployees_empid,
    });
  }, [auth_user, dispatch])

  const acceptCall = useCallback(async (data = callerInfo) => {
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    if (devices.filter(d => d.kind == "audioinput").length == 0) return alert("No Input media detected"); 
    console.log("Accepting the Call", data)
    const peerConnection = getPeerConnection();
    const socket = getSocket(auth_user?.elsemployees_empid);

    remoteStream.current = remoteStream.current || new MediaStream();
    localStream.current = localStream.current || await navigator.mediaDevices.getUserMedia({ audio: true });
    const remoteVideo = document.querySelector('#remoteVideo');
    remoteVideo.srcObject = remoteStream.current;
    remoteVideo.play();

    peerConnection.addEventListener("track", (e) => {
      console.log("Add Track From Peer", e);
      remoteStream.current?.addTrack(e.track, remoteStream.current);
      dispatch(setRemoteStream(remoteStream.current))
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
    dispatch(setCallingInfo({
      from : data.from,
      to: data.to
    }))
    dispatch(setRemoteStream(remoteStream.current))
    dispatch(setLocalStream(localStream.current))
    dispatch(setCallerInfo({}))
    // setPeerConnection(peerConnection)
  }, [auth_user?.elsemployees_empid, callerInfo, dispatch])

  return {
    localStream: localStream.current,
    remoteStream: remoteStream.current,
    callUser,
    endCall,
    acceptCall
  }
};