import React, { useRef, useState, useEffect, useMemo } from "react";
import "./groupMessage.css";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { IconButton, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import { getSocket } from "../../../socket";
import { setQuote } from "../../../Redux/actions/app";
import Utils from "../../../helper/util";
import {  sendGroupMessage } from "../../../api/message";
import { getUserGroups, seenGroupMessage } from "../../../api/chat";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { setGroupMessages } from "../../../Redux/actions/message";
import { DARKLIGHT, DARKMAIN } from "../../../Theme/colorConstant";
const useStyles = makeStyles({
  sendBtn: {
    width: "50px",
    height: "50px",
    background: "#267396",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    transition: ".3s",
    "&:hover": {
      background: "#d8ecf7",
      color: "#267396",
    },
  },
  attachBtn: {
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#267396",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    transition: ".3s",
    "&:hover": {
      background: "#d8ecf7",
      color: "#267396",
    },
  },
});

function MessageInput({ inputProps, attachment, open, setAttachment,setScrollDown }) {
  const classes = useStyles();
  const { auth_user, active_group, quote,groupMessages,isNightMode,searchText } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || { },
      active_group: store.chat.active_group || { },
      quote: store.app.quoteData || { },
      groupMessages:store.message.groupMessages || {},
      isNightMode:store.app.mode || false,
      searchText:store.app.searchText || "",
    };
  });
 
  const [message, setMessage] = useState("");
  const [isEmojiActive, setIsEmojiActive] = useState(false)
  const textInput = useRef();
  const dispatch = useDispatch();
  const [pastedImg, setPastedImg] = useState([]);
 
  const onEmojiClick = (event) => {
    setMessage(`${message}${event.native}`);
    textInput.current.innerText = `${message}${event.native}`;
  };
  
  // function to generate Image preview & multiple attachment
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
              alt="attachment"
            />
          </div>
        );
      }
      if (type === "video") {
        const url = URL.createObjectURL(item);
        return (
          <div className="attachMedia" key={index}>
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
          <div className="attachDocument" key={index}>
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
  // focus input field when page in load
  useEffect(() => {
    if(searchText.length < 1){
      textInput.current.focus();
    }
  }, [active_group, quote]);

  const deleteAttachment = (index) => {
    attachment.splice(index, 1);
    setAttachment([...attachment]);
  };

  const setToDefault = () => {
    setMessage("");
    setIsEmojiActive(false);
    textInput.current.innerHTML = "";
    setAttachment([]);
    setPastedImg([]);
    dispatch(setQuote(null));
  };
  // send message on enter
  const SendMessageOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.length > 0 || attachment.length > 0 || pastedImg.length > 0) {
        SendMessage();
      }
    }
  };
  const SendMessage =  () => {
    setToDefault();
    
    const messageParams = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
        group_id: active_group?.group_id,
        message_body: message,
        message_quoteid: quote?.message_id || null,
        message_quotebody: quote?.groupmessage_body || null,
        message_quoteuser: quote.from_username || null,
        message_attachment: attachment.length > 0 ? attachment : pastedImg,
      },
    };
    
    messageParams.data = Utils.getFormData(messageParams.data);
     dispatch(sendGroupMessage(messageParams))
      .then((res) => {
        setScrollDown(res);
        dispatch(setGroupMessages({...groupMessages,messages:[res.data.data,...groupMessages.messages]}))
        const seenParams = {
          data:{
            group_id:active_group.group_id,
            user_id:auth_user?.elsemployees_empid
          }
        }
        dispatch(seenGroupMessage(seenParams))
          .then(() => {
            const getGroupParams = {
              data: {
                loginuser_id: auth_user?.elsemployees_empid,
                user_id: auth_user?.elsemployees_empid,
              },
            };
            dispatch(getUserGroups(getGroupParams));
        })
        
        const attachments = res.data.data.groupmessage_attachment
        const socketParams = {
          from_username: auth_user?.elsemployees_name,
          from_userpicture: auth_user?.elsemployees_image,
          user_id: auth_user?.elsemployees_empid,
          loginuser_id: auth_user?.elsemployees_empid,
          group_id: active_group?.group_id,
          group_name: active_group?.group_name,
          message_body: message,
          message_id: Date.now(),
          fullTime: moment().format("Y-MM-D, h:mm:ss"),
          message_quoteid: res.data.quote ? res.data.quote?.message_id : null,
          message_quotebody: res.data.quote ? res.data.quote?.groupmessage_body : null,
          message_quoteuser: res.data.quote ? res.data.quote?.from_username : null,
          messageOn: "group",
          groupmessage_attachment: attachments || null
        };
        
        const socket = getSocket(auth_user?.elsemployees_empid);
        socket.emit("group-messaging", socketParams);
      })
      .catch((err) => console.warn(err));
  };
  const attachStyle = {
    background: isNightMode ? DARKMAIN :"#eee",
    height: "40vh",
  };
  const Emoji = () => {
    return (
      <div
        style={{ position: "absolute", bottom: "100%", left: "0" }}
      >
        <Picker
          onSelect={onEmojiClick}
           native={true}
        />
      </div>
    )
  }
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
            <div className="qoutMsg__container" style={{background: isNightMode ? DARKLIGHT : "#eeee", color: isNightMode ? "#fff": "#000"}}>
              {quote.groupmessage_body ? (
                <div>
                  <p className="qcMsg">
                    {quote.attachment ? "Attachment" : quote.groupmessage_body}
                  </p>
                  <p className="qcName">{quote.from_username}</p>
                  <IconButton
                    style={{position:"absolute", top:"1%", right:"0%"}}
                    onClick={() => {
                      dispatch(setQuote(null));
                    }}
                    
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                ""
              )}

              {isEmojiActive && (
                <Emoji/>
              )}
              <div
                className="inputField"
                ref={textInput}
                onKeyUp={(e) => {
                  setMessage(e.target.innerText);
                }}
                onPasteCapture={(e) => {
                  setPastedImg(e.clipboardData.files);
                }}
                data-placeholder={"Type a Message"}
                contentEditable={true}
              />
              <IconButton
                style={{position:"absolute", top:"1%", left:"0%"}}
                onClick={() => {
                  setIsEmojiActive(!isEmojiActive);
                }}
              >
                <EmojiEmotionsIcon
                  color={isEmojiActive ? "primary" : "inherit"}
                />
              </IconButton>
            </div>
          </div>
          {message.length > 0 ||
            attachment.length > 0 ||
            pastedImg.length > 0 ? (
            <IconButton className={classes.sendBtn} onClick={SendMessage}>
              <SendIcon />
            </IconButton>
          ) : (
            <label className="selectAttachment">
              <div className={classes.attachBtn}>
                <AttachmentIcon onClick={open} />
              </div>
              <input {...inputProps()} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageInput;
