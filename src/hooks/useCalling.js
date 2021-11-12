// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { getSocket, init } from "../socket";
// import Peer from "simple-peer";
// const useCalling = (myAudio, userAudio) => {
//   const { auth_user, active_user } = useSelector((store) => {
//     return {
//       auth_user: store.auth?.auth_user || {},
//       active_user: store.chat?.active_user || {},
//     };
//   });
//   useEffect(() => {
//     init(auth_user.elsemployees_empid);
//   }, [auth_user]);
//   const [me, setMe] = useState("");
//   const [stream, setStream] = useState();
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState();
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [idToCall, setIdToCall] = useState("");
//   const [callEnded, setCallEnded] = useState(false);
//   const [name, setName] = useState("");
//   const connectionRef = useRef();

//   useEffect(() => {
//     const socket = getSocket(auth_user.elsemployees_empid);
//     navigator.mediaDevices
//       .getUserMedia({ video: false, audio: true })
//       .then((stream) => {
//         setStream(stream);
//         myAudio.current.srcObject = stream;
//       });

//     socket.on("me", (id) => {
//       setMe(id);
//     });

//     socket.on("startCall", (data) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setName(data.name);
//       setCallerSignal(data.signal);
//     });
//   }, [auth_user.elsemployees_empid,myAudio]);

//   const startCall = (id) => {
//     const socket = getSocket(auth_user.elsemployees_empid);
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.emit("startCall", {
//         userToCall: id,
//         signalData: data,
//         from: me,
//         name: name,
//       });
//     });
//     peer.on("stream", (stream) => {
//       userAudio.current.srcObject = stream;
//     });
//     socket.on("callAccepted", (signal) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });

//     connectionRef.current = peer;
//   };

//   const answerCall = () => {
//     const socket = getSocket(auth_user.elsemployees_empid);
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.emit("answerCall", { signal: data, to: caller });
//     });
//     peer.on("stream", (stream) => {
//       userAudio.current.srcObject = stream;
//     });

//     peer.signal(callerSignal);
//     connectionRef.current = peer;
//   };

//   const leaveCall = () => {
//     setCallEnded(true);
//     connectionRef.current.destroy();
//   };
// };

// export default useCalling;
