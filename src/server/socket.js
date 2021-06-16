import { Server } from "socket.io";
import axios from 'axios';
import env from '../env.json';

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
      triggerPushMsg(data?.message_to, data?.message_body)
      socketMappings[data?.message_to]?.emit("messaging", data);
    });

    socket.on("group-messaging", (data) => {
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            triggerPushMsg(participant.elsemployees_empid, data?.message_body)
            socketMappings[participant.elsemployees_empid]?.emit("messaging", data);
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

    socket.on("disconnect", (socket) => {
      console.log("disconnected", socket);
    });
  });
};
