import { Server } from "socket.io";
import axios from "axios";
import { triggerPushMsg } from "./webpush";
import express from 'express';

const router = express.Router();
const socketMappings = {};

export const withSocket = (app) => {
  const io = new Server(app);

  const workspaces = io.of(/^\/user-\d+$/);

  workspaces.on("connection", (socket) => {
    socketMappings[socket.nsp.name.split("-")[1]] = socket.id;
    // ********************************* socket for calling *********************************

    // setInterval(() => {
    //   socket.emit("online-users", Object.keys(socketMappings));
    // }, 5000)

    socket.on("messaging", async (data) => {
      workspaces.to(socketMappings[data?.message_to])?.emit("messaging", data);
      try {
        const notification = {
          title: data?.message_originalname,
          text: data?.message_body,
          image: data?.from_userpicture,
          type:"message",
        };
        await triggerPushMsg(data?.message_to, notification);
      } catch(e) {
        console.log(e);
      }
    });

    socket.on("group-messaging", (data) => {
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach(async (participant) => {
            if (participant.elsemployees_empid != data.user_id) {
              workspaces.to(socketMappings[participant.elsemployees_empid])?.emit(
                "messaging",
                data
              );
              try {
                const notification = {
                  title: `${data?.from_username} in ${data?.group_name}`,
                  text: data?.message_body,
                  image: data?.from_userpicture,
                  type:"message",
                };
                await triggerPushMsg(participant.elsemployees_empid, notification);
              } catch(e) {
                console.log(e);
              }
            }
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-member", (data) => {
      workspaces.to(socketMappings[data.member_id])?.emit("group-member", data);
      axios
        .post(`${process.env.RAZZLE_BASE_URL}/bwccrm/groupparticipants`, {
          user_id: data.user_id,
          group_id: data.group_id,
        })
        .then((res) => {
          res.data.participants?.forEach((participant) => {
            workspaces.to(socketMappings[participant.elsemployees_empid])?.emit(
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
              workspaces.to(socketMappings[participant.elsemployees_empid])?.emit(
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
              workspaces.to(socketMappings[participant.elsemployees_empid])?.emit(
                "isGroupWindowOpen",
                data
              );
            }
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on("call-user", async (data) => {
      workspaces.to(socketMappings[data.to])?.emit("call-made", data);
      try {
        const notification = {
          title: "Incoming Call",
          text: `${data?.fromUser?.elsemployees_name || data?.from} is calling`,
          image: data?.fromUser?.elsemployees_image,
          type:"incoming-call",
          data: {
            offer: data?.offer,
            from: data?.from,
          }
        };
        await triggerPushMsg(data?.to, notification);
      } catch(e) {
        console.log(e)
      }
    });

    socket.on("icecandidate-sent", async (data) => {
      workspaces.to(socketMappings[data?.user_id])?.emit(
        "icecandidate-receive",
        data.candidate
      );
    });

    socket.on("make-answer", async (data) => {
      workspaces.to(socketMappings[data.from])?.emit("answer-made", {
        // request approved from receiver notify caller
        answer: data.answer,
        from: data.from, // who is calling
        to: data.to, // who is receiving
      });
    });

    socket.on("request-end-call", async (data) => {
      workspaces.to(socketMappings[data.to])?.emit("end-call", data);
    });

    socket.on("typing", (data) => {
      workspaces.to(socketMappings[data?.user_id])?.emit("typing", data);
    });
    socket.on("leaveTyping", (data) => {
      workspaces.to(socketMappings[data?.user_id])?.emit("leaveTyping", data);
    });
    socket.on("seen", (data) => {
      workspaces.to(socketMappings[data?.message_to])?.emit("seen", data);
    });
    socket.on("isWindowOpen", (data) => {
      workspaces.to(socketMappings[data?.message_to])?.emit("isWindowOpen", data);
    });
    socket.on("disconnect", () => {
      if(socketMappings[socket.nsp.name.split("-")[1]]) {
        delete socketMappings[socket.nsp.name.split("-")[1]]
        console.log("disconnected", socket.nsp.name.split("-")[1])
      }
    });
  });

  return app;
};

router.get('/active-users', (req, res) => {
  return res.json(Object.keys(socketMappings))
});

router.post('/dialpad/send-text', (req, res) => {
  console.log(typeof req.body);
  console.log(req.body);
  return res.json({});
})

export default router;