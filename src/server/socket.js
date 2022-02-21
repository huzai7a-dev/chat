import { Server } from "socket.io";
import axios from "axios";
import { triggerPushMsg } from "./webpush";

const socketMappings = {};

export const withSocket = (app) => {
  const io = new Server(app);

  io.on("connection", (socket) => {
    console.log("a user connected with id", socket.id);
  });

  const workspaces = io.of(/^\/user-\d+$/);

  workspaces.on("connection", (socket) => {
    socketMappings[socket.nsp.name.split("-")[1]] = socket;

    // ********************************* socket for calling *********************************

    socket.on("messaging", async (data) => {
      const notification = {
        title: data?.message_originalname,
        text: data?.message_body,
        image: data?.from_userpicture,
      };
      triggerPushMsg(data?.message_to, notification);
      socketMappings[data?.message_to]?.emit("messaging", data);
    });

    socket.on("group-messaging", (data) => {
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach((participant) => {
            const notification = {
              title: `${data?.from_username} in ${data?.group_name}`,
              text: data?.message_body,
              image: data?.from_userpicture,
            };

            if (participant.elsemployees_empid != data.user_id) {
              triggerPushMsg(participant.elsemployees_empid, notification);
              socketMappings[participant.elsemployees_empid]?.emit(
                "messaging",
                data
              );
            }
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-member", (data) => {
      socketMappings[data.member_id]?.emit("group-member", data);
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach((participant) => {
            socketMappings[participant.elsemployees_empid]?.emit(
              "group-member",
              data
            );
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-seen", (data) => {
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach((participant) => {
            if (participant.elsemployees_empid != data.user_id) {
              socketMappings[participant.elsemployees_empid]?.emit(
                "group-seen",
                data
              );
            }
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("isGroupWindowOpen", (data) => {
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach((participant) => {
            if (participant.elsemployees_empid != data.user_id) {
              socketMappings[participant.elsemployees_empid]?.emit(
                "isGroupWindowOpen",
                data
              );
            }
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("call-user", async (data) => {
      socketMappings[data.to]?.emit("call-made", {
        // request it to receiver
        offer: data.offer,
        from: data.from, // who is calling
        to: data.to, // who is receiving
      });
    });

    socket.on("icecandidate-sent", async (data) => {
      socketMappings[data?.user_id]?.emit(
        "icecandidate-receive",
        data.candidate
      );
    });

    socket.on("make-answer", async (data) => {
      socketMappings[data.from]?.emit("answer-made", {
        // request approved from receiver notify caller
        answer: data.answer,
        from: data.from, // who is calling
        to: data.to, // who is receiving
      });
    });

    socket.on("request-end-call", async (data) => {
      socketMappings[data.to]?.emit("end-call", data);
    });

    socket.on("typing", (data) => {
      socketMappings[data?.user_id]?.emit("typing", data);
    });
    socket.on("leaveTyping", (data) => {
      socketMappings[data?.user_id]?.emit("leaveTyping", data);
    });
    socket.on("seen", (data) => {
      socketMappings[data?.message_to]?.emit("seen", data);
    });
    socket.on("isWindowOpen", (data) => {
      socketMappings[data?.message_to]?.emit("isWindowOpen", data);
    });
    socket.on("disconnect", (socket) => {
      console.log("disconnected", socket);
    });
  });
};
