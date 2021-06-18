import { Server } from "socket.io";
import axios from 'axios';
import env from '../env.json';
import { triggerPushMsg } from './webpush'

const socketMappings = {};

export const withSocket = (app) => {
  const io = new Server(app);

  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  const workspaces = io.of(/^\/user-\d+$/);

  workspaces.on("connection", (socket) => {
    console.log("Connected", socket.nsp.name);
    socketMappings[socket.nsp.name.split("-")[1]] = socket;

    socket.on("messaging", async (data) => {
      const notification = {
        title: data?.message_originalname,
        text: data?.message_body,
      }
      triggerPushMsg(data?.message_to, notification)
      socketMappings[data?.message_to]?.emit("messaging", data);
    });

    socket.on("group-messaging", (data) => {
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            const notification = {
              title: participant.elsemployees_name,
              text: data?.message_body,
            }
            triggerPushMsg(participant.elsemployees_empid, notification)
            socketMappings[participant.elsemployees_empid]?.emit("messaging", data);
          })
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-member", (data) => {
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            socketMappings[participant.elsemployees_empid]?.emit("group-member", data);
          })
        })
        .catch((err) => console.log(err));
    });
    socket.on("typing", (data) => {
      socketMappings[data?.user_id]?.emit("typing", data);
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
