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
        image: data?.from_userpicture,
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
              title: `${data?.from_username} in ${data?.group_name}`,
              text: data?.message_body,
              image: data?.from_userpicture,
            }

            if(participant.elsemployees_empid != data.user_id) {
              triggerPushMsg(participant.elsemployees_empid, notification)
              socketMappings[participant.elsemployees_empid]?.emit("messaging", data);
            }
          })
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-member", (data) => {
      socketMappings[data.member_id]?.emit("group-member", data);
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            socketMappings[participant.elsemployees_empid]?.emit("group-member", data);
          })
        })
        .catch((err) => console.log(err));
    });

    socket.on("group-seen", (data) => {
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            if(participant.elsemployees_empid != data.user_id) {
              socketMappings[participant.elsemployees_empid]?.emit("group-seen", data);
            }
          })
        })
        .catch((err) => console.log(err));
    });

    socket.on("isGroupWindowOpen", (data) => {
      console.log("Group Window")
      axios
        .post(`${env.url}/bwccrm/groupparticipants`, {user_id: data.user_id, group_id: data.group_id})
        .then((res) => {
          res.data.participants?.forEach(participant => {
            if(participant.elsemployees_empid != data.user_id) {
              socketMappings[participant.elsemployees_empid]?.emit("isGroupWindowOpen", data);
            }
          })
        })
        .catch((err) => console.log(err));
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
