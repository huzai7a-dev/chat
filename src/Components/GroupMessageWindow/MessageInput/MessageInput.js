import React, { useRef, useState, useEffect, useMemo } from "react";
import "./groupMessage.css";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import {
  groupMsgs,
  quote,
  sendMsg,
  updateGroup,
} from "../../../Redux/Action";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import { nanoid } from "nanoid";
import { getSocket } from "../../../socket";
// import Picker from 'emoji-picker-react';
function MessageInput({ inputProps, attachment, open, setAttachment }) {
  const data = useSelector((state) => {
    return state;
  });

  const [message, setMessage] = useState("");
  const [attach, setAttach] = useState();
  const [emojiPicker, setemojiPicker] = useState(false);
  const textInput = useRef();
  const onEmojiClick = (event, emojiObject) => {
    setMessage(`${message}${emojiObject.emoji}`);
    textInput.current.innerText = `${message}${emojiObject.emoji}`;
  };
  const dispatch = useDispatch();

  const deleteAttachment = (index) => {
    attachment.splice(index, 1);
    setAttachment([...attachment]);
  };
  // function to generate Image preview & multiple attachment
  const AttachmentPreview = useMemo(() => {
    return attachment.map((item, index) => {
      const type = item.type.split("/")[0];
      if (type === "image") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia">
            <CloseIcon
              className="cutIcon"
              onClick={() => {
                deleteAttachment(index);
              }}
            />
            <img
              key={item.path}
              src={url}
              height="auto"
              width="150px"
              alt="attachment"
            />
          </div>
        );
      }
      if (type === "video") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia">
            <CloseIcon
              className="cutIcon"
              onClick={() => {
                deleteAttachment(index);
              }}
            />
            <video
              key={item.path}
              src={url}
              height="auto"
              width="150px"
              alt="attachment"
            />
          </div>
        );
      } else {
        return (
          <div className="attachDocument">
            <CloseIcon
              className="cutIcon"
              onClick={() => {
                deleteAttachment(index);
              }}
            />
            <FileCopyIcon />
            <p>{item.name}</p>
            <p>{`${item.size}KB`}</p>
          </div>
        );
      }
      return null;
    });
  }, [attachment]);
  // send message on enter
  const SendMessageOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.length > 0 || attachment.length > 0) {
        SendMessage();
      }
    }
  };
  const SendMessage = () => {
    // function to generate id for temp message
    const tempMsgId = nanoid();
    dispatch(
      addTypedMsg(
        {
          tempText: message,
          tempAttachment: attachment,
          id: tempMsgId,
        })
    );
    const paramData = {
      from_username: data.Auth.data.elsemployees_name,
      from_userpicture: data.Auth.data.elsemployees_image,
      user_id: data.Auth.data?.elsemployees_empid,
      loginuser_id: data.Auth.data?.elsemployees_empid,
      group_id: data.groupChat?.group_id,
      group_name: data.groupChat?.group_name,
      message_body: message,
      message_id: Date.now(),
      fullTime: moment().format('Y-MM-D, h:mm:ss'),
      message_quoteid: data.quote ? data.quote?.message_id : null,
      message_quotebody: data.quote ? data.quote?.groupmessage_body : null,
      message_quoteuser: data.quote ? data.quote?.from_username : null,
      messageOn:"group"
    };
    const formData = new FormData();
    formData.append("user_id", data.Auth.data?.elsemployees_empid);
    formData.append("loginuser_id", data.Auth.data?.elsemployees_empid);
    formData.append("group_id", data.groupChat?.group_id);
    formData.append("message_body", message);
    formData.append(
      "message_quoteid", data.quote?.message_id || null
    );
    formData.append(
      "message_quotebody",
      data?.quote ? data?.quote.groupmessage_body : null
    );
    formData.append(
      "message_quoteuser",
      data?.quote ? data?.quote.from_username : null
    );
    attachment.forEach((element) => {
      formData.append("message_attachment[]", element);
    });
    setMessage("");
    setemojiPicker(false);
    textInput.current.innerHTML = "";
    setAttachment([]);
    dispatch(quote(null));
    return axios
      .all([
        axios.post("/api/bwccrm/sendMessage", formData),
        axios.post("/api/bwccrm/getUserGroups", {
          loginuser_id: data.Auth.data?.elsemployees_empid,
          user_id: data.Auth.data?.elsemployees_empid,
        }),
      ])
      .then((res) => {
        const socket = getSocket();
        socket.emit("group-messaging", paramData);
        dispatch(sendMsg(res[0].data));
        dispatch(updateGroup(res[1].data));
        axios
          .post("/api/bwccrm/fetchMessageGroup", {
            group_id: data.groupChat?.group_id,
            user_id: data.Auth.data?.elsemployees_empid,
          })
          .then((res) => {
            dispatch(groupMsgs(res.data.messages));
            dispatch(removeFromTypedMessage(tempMsgId))
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const attachStyle = {
    background: "#eee",
    height: "40vh",
  };
  return (
    <div
      className="inputAttachContainer"
      style={attachment.length ? attachStyle : null}
    >
      <div className="attachmentPreview">
        {attachment ? AttachmentPreview : null}
      </div>
      <div onKeyDown={SendMessageOnEnter} className="messageInput">
        <div className="inputContainer">
          <div className="inputField__container">
            <div className="qoutMsg__container">
              {data.quote ? (
                <div>
                  <p className="qcMsg">
                    {data.quote.attachment
                      ? "Attachment"
                      : data.quote.groupmessage_body}
                  </p>
                  <p className="qcName">{data.quote.from_username}</p>
                  <IconButton
                    onClick={() => {
                      dispatch(quote(null));
                    }}
                    style={{ zIndex: "1000" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                ""
              )}
              {/* {emojiPicker &&(
<div style={{position:"absolute", bottom:"100%", right:"0"}}>
{/ <Picker onEmojiClick={onEmojiClick} native={true} style={{overflowX:"none"}} /> /}
</div>)
} */}
              <div
                className="inputField"
                ref={textInput}
                onKeyUp={(e) => {
                  setMessage(e.target.innerText);
                }}
                data-placeholder={"Type a Message"}
                contentEditable={true}
              />
              {/* <IconButton onClick={()=>{setemojiPicker(!emojiPicker)}}>
{/ <EmojiEmotionsIcon color={emojiPicker ? "primary" : "inherit"}/> /}
</IconButton> */}
            </div>
          </div>
          {message.length > 0 || attachment.length > 0 ? (
            <IconButton className="sendBtn" onClick={SendMessage}>
              <SendIcon />
            </IconButton>
          ) : (
            <label
              style={{
                background: "#eeeeee",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "Center",
              }}
            >
              <AttachmentIcon onClick={open} />
              <input {...inputProps()} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
