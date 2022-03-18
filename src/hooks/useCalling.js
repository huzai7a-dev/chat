import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../config/socket";
import { useRTCClient } from "../helper/rtcClient";
import { getPeerConnection } from "../config/peerconnection";
// import { setCallerInfo } from "../Redux/actions/app";
import Modal from "react-modal";
import OnCall from "../Components/Call/OnCall";
import OnCalling from "../Components/Call/OnCalling";
import ToReceiveCall from "../Components/Call/ToReceiveCall";
import { setActiveCaller, setCallingToUser } from "../Redux/actions/call";

const useCalling = () => {
  
  const dispatch = useDispatch();
  const [incomingOffer, setIncomingOffer] = useState();

  const { auth_user, callingTo, activeCaller } = useSelector((store) => {
    return {
      callingTo: store.call.callingTo,
      activeCaller: store.call.activeCaller,
      auth_user: store.auth.auth_user || {},
    };
  }
  );

  const { acceptCall, callUser, processAfterAccept, requestEndCall, endCall } = useRTCClient();

  const onAcceptIncomingCall = useCallback(() => {
    acceptCall(incomingOffer);
    if(incomingOffer.fromUser) {
      dispatch(setActiveCaller(incomingOffer.fromUser))
    } else {
      dispatch(setActiveCaller({
        elsemployees_empid: incomingOffer.from,
        elsemployees_name: incomingOffer.from,
      }))
    }
  }, [incomingOffer, acceptCall, dispatch])

  const onRejectIncomingCall = useCallback(() => {
    requestEndCall(incomingOffer.from);
    setIncomingOffer();
    dispatch(setCallingToUser())
    dispatch(setActiveCaller())
  }, [incomingOffer, requestEndCall, dispatch])

  const onRejectOutgoingCall = useCallback(() => {
    requestEndCall(callingTo.elsemployees_empid);
    setIncomingOffer();
    dispatch(setCallingToUser())
    dispatch(setActiveCaller())
  }, [requestEndCall, callingTo, dispatch]);

  const registerSWCallActions = useCallback(async () => {
    if (!("Notification" in window)) return console.log("Not");
    if (Notification.permission !== "granted") return console.log("Per");
    if (!("serviceWorker" in navigator)) return console.log("SW");

    navigator.serviceWorker.addEventListener('message', event => {
      const { type, data } = event.data
      switch(type) {
        case "call::accept": {
          if(data) {
            acceptCall(data);
            setIncomingOffer(data);
            dispatch(setActiveCaller({
              elsemployees_empid: data.from,
              elsemployees_name: data.from,
            }))
          }
          return;
        }
        case "call::reject": {
          return 
        }
      }
    });

  },[acceptCall])

  useEffect(() => {
    const socket = getSocket(auth_user.elsemployees_empid);
    socket.on("call-made", (data) => {
      setIncomingOffer(data);
    });
    return () => {
      socket.off("call-made");
    };
  }, [auth_user.elsemployees_empid, dispatch]);

  useEffect(() => {
    registerSWCallActions();
  }, [registerSWCallActions])

  useEffect(() => {
    const socket = getSocket(auth_user.elsemployees_empid);
    socket.on("answer-made", async (data) => {
      processAfterAccept(data);
      dispatch(setActiveCaller(callingTo))
    });
    return () => {
      socket.off("answer-made");
    };
  }, [auth_user.elsemployees_empid, callingTo, dispatch, processAfterAccept]);

  useEffect(() => {
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.on("end-call", async () => {
      dispatch(setCallingToUser())
      dispatch(setActiveCaller())
      setIncomingOffer();
      endCall();
    });
    return () => {
      socket.off("end-call");
    };
  }, [auth_user, endCall, dispatch]);

  useEffect(() => {
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.on("icecandidate-receive", async (data) => {
      const peerConnection = getPeerConnection();
      try {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(JSON.parse(data))
        );
      } catch (e) {
        console.error(data, e);
      }
    });
    return () => {
      socket.off("icecandidate-receive");
    };
  }, [auth_user]);

  const renderOnCall = useMemo(() => {
    return (
      <Modal style={{ content: { padding: 0 } }} isOpen={!activeCaller?.elsemployees_empid && callingTo?.elsemployees_empid}>
        <OnCall callUser={callUser} onRejectOutgoingCall={onRejectOutgoingCall} />
      </Modal>
    );
  }, [callingTo, callUser, onRejectOutgoingCall, activeCaller]);

  const renderOngoingCall = useMemo(() => {
    return (
      <OnCalling onReject={incomingOffer ? onRejectIncomingCall : onRejectOutgoingCall} />
    );
  }, [incomingOffer, onRejectIncomingCall, onRejectOutgoingCall]);

  const renderIncomingAlert = useMemo(() => {
    return (
      <Modal
        style={{ content: { padding: 0, background: "transparent", border: 0 } }}
        isOpen={!activeCaller?.elsemployees_empid && incomingOffer && incomingOffer?.offer}
      >
        <ToReceiveCall fromUser={incomingOffer?.fromUser || {}} onAcceptIncomingCall={onAcceptIncomingCall} onRejectIncomingCall={onRejectIncomingCall} />
      </Modal>
    );
  }, [incomingOffer, onAcceptIncomingCall, onRejectIncomingCall, activeCaller]);

  return {
    renderOnCall,
    renderOngoingCall,
    renderIncomingAlert,
  };
};

export default useCalling;
