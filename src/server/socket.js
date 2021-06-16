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

    socket.on("messaging", (data) => {
      socketMappings[data?.message_to]?.emit("messaging", data);
    });

    socket.on("group-messaging", (data) => {
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          
          res.data.participants?.forEach(participant => {
            console.log(!!socketMappings[participant.elsemployees_empid], participant.elsemployees_empid)
            socketMappings[participant.elsemployees_empid]?.emit("messaging", data);
          })
        })
        .catch((err) => console.log(err));
    });

    socket.on("groupMember", (data) => {
      socketMappings[data?.user_id]?.emit("groupMember", data);
    });

    socket.on("seen", (data) => {
      socketMappings[data?.message_to]?.emit("seen", data);
    });

    socket.on("disconnect", (socket) => {
      console.log("disconnected", socket);
    });
  });
};
