let pc = null;

const defaultRTCConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

export const createNewPeerConnection = (configuration) => {
  pc = new RTCPeerConnection(configuration);

  // pc.addEventListener("icecandidate", (event) => {
  //   if (event.candidate) {
  //     console.log("Ice Candidate", event);
  //   }
  // });

  // pc.addEventListener("connectionstatechange", (event) => {
  //   if (pc.connectionState === "connected") {
  //     console.log("Peer Connected", event);
  //   }
  //   if (pc.connectionState === "disconnected") {
  //     console.log("Disconnected Peer connection", event);
  //   }
  // });

  return pc;
};

export const getPeerConnection = (configuration) => {
  if (pc) return pc;
  else return createNewPeerConnection(configuration)
};

export const setPeerConnection = (npc) => (pc = npc); // incase a pc is needed an update
