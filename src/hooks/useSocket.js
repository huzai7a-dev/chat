import React, { useEffect, useState, useRef } from "react";
import { getSocket, init } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  groupChat,
  groupMemberInfo,
  groupMsgs,
  seen,
  updateGroup,
  upDateUser,
  userMsgs,
} from "../Redux/Action";
import { nanoid } from "nanoid";
import axios from "axios";
const useSocket = () => {
  const data = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const [socket, setSocket] = useState();
  useEffect(() => {
    setSocket(init(data.Auth?.data.elsemployees_empid));
  }, [data.Auth]);

  useEffect(() => {
    if (socket) {
      socket.on("messaging", (resData) => {
        
        const userMessage = {
          message_body: resData.message_body,
          message_from: resData.user_id,
          from_userpicture: resData.from_userpicture,
          message_to: resData.message_to,
          from_username: resData.message_originalname,
          message_id: resData.message_id,
          message_quotebody: resData.message_quotebody,
          message_quoteid: resData.message_quoteid,
          message_quoteuser: resData.message_quoteuser,
          fullTime: resData.fullTime,
          // message_attachment:resData.attachment
        };
        
        if (resData.user_id == data.chat?.elsemployees_empid) {
          axios
          .post("/api/bwccrm/makeSeen", {
            user_id: resData.user_id,
            loginuser_id: data.Auth.data?.elsemployees_empid,
          }).then((res) => {
            const paramData = {
              message_to:resData.user_id
             }
             const socket = getSocket();
             socket.emit("isWindowOpen",paramData)
          })
          } 
        const groupMessage = {
          groupmessage_body: resData.message_body,
          from_userpicture: resData.from_userpicture,
          message_from: resData.loginuser_id,
          from_username: resData.from_username,
          message_id: resData.message_id,
          group_id: resData.group_id,
          groupmessage_quotebody: resData.message_quotebody,
          groupmessage_quoteid: resData.message_quoteid,
          groupmessage_quoteuser: resData.message_quoteuser,
          fullTime: resData.fullTime,
        };

        if (userMessage.message_from === data.chat?.elsemployees_empid) {
          dispatch(userMsgs([...data.userMsgs, userMessage]));
          axios
            .post("/api/bwccrm/getContactsUser", {
              loginuser_id: data.Auth.data?.elsemployees_empid,
              user_id: data.Auth.data?.elsemployees_empid,
            })
            .then((res) => {
              dispatch(upDateUser(res.data.contacts));
            });
        } else if (data.groupChat?.group_id === groupMessage.group_id) {
          dispatch(groupMsgs([...data.groupMsgs, groupMessage]));
          axios
            .post("/api/bwccrm/getUserGroups", {
              loginuser_id: data.Auth.data?.elsemployees_empid,
              user_id: data.Auth.data?.elsemployees_empid,
            })
            .then((res) => {
              dispatch(updateGroup(res.data));
            });
        } else {
          axios
            .post("/api/bwccrm/getContactsUser", {
              loginuser_id: data.Auth.data?.elsemployees_empid,
              user_id: data.Auth.data?.elsemployees_empid,
            })
            .then((res) => {
              dispatch(upDateUser(res.data.contacts));
            });
        }
      });
      return () => {
        socket.off('messaging')
      }
    }
  }, [data.userMsgs, data.groupMsgs, data.chat, data.groupChat]);

  useEffect(() => {
    if (socket) {
      socket.on("seen", (res) => {
        dispatch(seen(res));
        axios
          .post("/api/bwccrm/fetchMessage", {
            from_id: data.Auth.data?.elsemployees_empid,
            to_id: data.chat?.elsemployees_empid,
            user_id: data.Auth.data?.elsemployees_empid,
          })
          .then((res) => {
            dispatch(userMsgs(res.data.messages));
          });
      });
      return () => {
        socket.off('seen')
      }
    }
  }, [data.chat]);

  useEffect(() => {
    if (socket) {
      socket.on("isWindowOpen", (res) => {
        axios
        .post("/api/bwccrm/fetchMessage", {
          from_id: data.Auth.data?.elsemployees_empid,
          to_id: data.chat?.elsemployees_empid,
          user_id: data.Auth.data?.elsemployees_empid,
        })
        .then((res) => {
          dispatch(userMsgs(res.data.messages));
        });
      });
      return () => {
        socket.off('isWindowOpen')
      }
    }
  });

  useEffect(() => {
    if (socket) {
      socket.on("group-member", (res) => {
        dispatch(groupMemberInfo(res));
        axios
          .post("/api/bwccrm/getUserGroups", {
            loginuser_id: data.Auth.data.elsemployees_empid,
            user_id: data.Auth.data.elsemployees_empid,
          })
          .then((res) => {
            dispatch(updateGroup(res.data));
            for (let i = 0; i < res.data; i++) {
              if(res.data[i]?.group_id == data.groupChat?.group_id){
                return 
              }
            }
            dispatch(groupChat(null))
          })
      });
      return () => {
        socket.off('group-member')
      }
    }
  });
  
  return socket;
};
export default useSocket;
