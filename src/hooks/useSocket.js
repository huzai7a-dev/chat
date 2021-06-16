import React, { useEffect, useState, useRef } from "react";
import { init } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { groupMsgs, seen, upDateUser, userMsgs } from "../Redux/Action";
import { nanoid } from "nanoid";
import axios from "axios";
const useSocket = () => {
  const data = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const socket = useRef();
  useEffect(() => {
    socket.current = init(data.Auth?.data.elsemployees_empid);
  }, [data.Auth]);

  useEffect(() => {
    if (socket.current) {
      socket.current?.on("messaging", (resData) => {
        const userMessage = {
          message_body: resData.message_body,
          message_from: resData.user_id,
          from_userpicture: resData.from_userpicture,
          message_to: resData.message_to,
          from_username: resData.message_originalname,
          message_id: resData.message_id,
          message_quotebody: resData.message_quotebody,
          message_quoteid: resData.message_quotebody,
          message_quoteuser: resData.message_quotebody,
          fullTime: resData.fullTime,
          // message_attachment:resData.attachment
        };

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

        if (resData.message_to === data.Auth?.data.elsemployees_empid) {
          dispatch(userMsgs([...data.userMsgs, userMessage]));
          axios
            .post("/api/bwccrm/getContactsUser", {
              loginuser_id: data.Auth.data?.elsemployees_empid,
              user_id: data.Auth.data?.elsemployees_empid,
            })
            .then((res) => {
              dispatch(upDateUser(res.data.contacts));
            });
        } else if (data.groupChat.group_id === resData.group_id) {
          dispatch(groupMsgs([...data.groupMsgs, groupMessage]));
        }
      });
    }
  }, [data.userMsgs, data.groupMsgs]);
  useEffect(() => {
    if (socket.current) {
      socket.current?.on("seen", (res) => {
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
    }
  }, [data.chat]);

  useEffect(() => {
   if (socket.current) {
     socket.current.on("groupMember", (res) => {
       console.log(res);
     })
   }
  },[])
  return socket.current;
};

export default useSocket;
