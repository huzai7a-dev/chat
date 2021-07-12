import React, { useMemo, useRef, useState } from "react";
import "./MessageInput.css";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import { Button, IconButton } from "@material-ui/core";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTypedMsg, quote, removeFromTypedMessage } from "../../../Redux/Action";
import { nanoid } from "nanoid";
import moment from "moment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
// import Picker from "emoji-picker-react";
import {
  searchData,
  upDateUser,
  sendMsg,
  userMsgs,
} from "../../../Redux/Action";
import { getSocket } from "../../../socket";
import { isMoment } from "moment";



function MessageInput({ inputProps, attachment, open, setAttachment }) {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [emojiPicker, setemojiPicker] = useState(false);
  const textInput = useRef();
  const data = useSelector((state) => {
    return state;
  });
  
  // function to delete selected attachment
  const deleteAttachment = (index) => {
    attachment.splice(index, 1);
    setAttachment([...attachment]);
  };
  // function to make attachment preview and rendering multiple attachment
  const onEmojiClick = (event, emojiObject) => {
    setMessage(`${message}${emojiObject.emoji}`);
    textInput.current.innerText = `${message}${emojiObject.emoji}`;
  };
  const AttachmentPreview = useMemo(() => {
    return attachment.map((item, index) => {
      const type = item.type.split("/")[0];
      if (type === "image") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia" key={index}>
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
              alt="Attachment"
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
            <video key={item.path} src={url} height="auto" width="150px" />
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
  // send messg on enter
  const SendMessageOnEnter = (e) => {
    if(e.keyCode == 13 && e.shiftKey) {
      setMessage(`${message}\n`)
    }
    if (e.keyCode == 13 && !e.shiftKey) {
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
      addTypedMsg({
          tempText: message,
          tempAttachment: attachment,
          id: tempMsgId,
        })
    );
    
    const paramData = {
      message_originalname:data.Auth.data.elsemployees_name,
      user_id: data.Auth.data?.elsemployees_empid,
      message_to: data.chat?.elsemployees_empid,
      message_body: message,
      from_userpicture:data.Auth.data.elsemployees_image,
      message_quoteid:  data.quote?.message_id || null,
      message_quotebody: data.quote?.message_body || null,
      message_quoteuser: data.quote?.from_username || null,
      attachment: attachment.map((attach) => { return attach }),
      message_id: Date.now(),
      fullTime: moment().format('Y-MM-D, h:mm:ss'),
      messageOn:"user"
    };
    
    const formData = new FormData();
    formData.append("user_id", data.Auth.data?.elsemployees_empid);
    formData.append("loginuser_id", data.Auth.data?.elsemployees_empid);
    formData.append("message_to", data.chat?.elsemployees_empid);
    formData.append("message_body", message);
    formData.append(
      "message_quoteid", data.quote?.message_id || null
    );
    formData.append(
      "message_quotebody", data.quote?.message_body || null
    );
    formData.append(
      "message_quoteuser", data.quote?.from_username || null
    );
    attachment.forEach((element) => {
      formData.append("message_attachment[]", element);
    });
    dispatch(searchData(""));
    setMessage("");
    setemojiPicker(false);
    textInput.current.innerHTML = "";
    setAttachment([]);
    dispatch(quote(null));
    return axios
      .post("/api/bwccrm/sendMessage", formData)
      .then((res) => {
        const socket = getSocket(data.Auth.data?.elsemployees_empid);
        socket.emit("messaging", paramData);
        axios
          .post("/api/bwccrm/fetchMessage", {
            from_id: data.Auth.data?.elsemployees_empid,
            to_id: data.chat?.elsemployees_empid,
            user_id: data.Auth.data?.elsemployees_empid,
          })
          .then((res) => {
            axios
              .post("/api/bwccrm/getContactsUser", {
                loginuser_id: data.Auth.data?.elsemployees_empid,
                user_id: data.Auth.data?.elsemployees_empid,
              })
              .then((res) => {
                dispatch(upDateUser(res.data.contacts));
              })
              .catch((err) => {
                console.log(err);
              });
            dispatch(userMsgs(res.data.messages));
            dispatch(removeFromTypedMessage(tempMsgId))
          });
        dispatch(sendMsg(res.data));
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
                      : data.quote.message_body}
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
              ) : null}
              {emojiPicker && (
                <div
                  style={{ position: "absolute", bottom: "100%", right: "0" }}
                >
                  {/* <Picker
                    onEmojiClick={onEmojiClick}
                    native={true}
                    skinTone="1f3fd"
                    size="40px"
                  /> */}
                </div>
              )}
              <div
                className="inputField"
                ref={textInput}
                onKeyUp={(e) => {
                  setMessage(e.target.innerText);
                }}
                data-placeholder={"Type a Message"}
                contentEditable
                style={{ whiteSpace: 'pre-wrap' }}
              />
              <IconButton
                onClick={() => {
                  setemojiPicker(!emojiPicker);
                }}
              >
                {/* <EmojiEmotionsIcon
                  color={emojiPicker ? "primary" : "inherit"}
                /> */}
              </IconButton>
            </div>
          </div>

          {message.length > 0 || attachment.length > 0 ? (
            <Button className="sendBtn" onClick={SendMessage}>
              <SendIcon />
            </Button>
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
