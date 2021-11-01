import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MessageInput.css";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import MicIcon from "@material-ui/icons/Mic";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { setQuote } from "../../../Redux/actions/app";
import { getSocket } from "../../../socket";
import { getContactsUser } from "../../../api/chat";
import { sendMessage } from "../../../api/message";
import Utils from "../../../helper/util";
import { setUserMessages } from "../../../Redux/actions/message";
import { DARKLIGHT, DANGER } from "../../../Theme/colorConstant";
import { useReactMediaRecorder } from "react-media-recorder";
import Recorder from "./recorder";


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
  micIcon: {
    color: DANGER,
  },
});
function MessageInput({
  inputProps,
  attachment,
  open,
  setAttachment,
  setScrollDown,
}) {
  const [message, setMessage] = useState("");
  const [isRecording, setRecording] = useState(false);
  const [pastedImg, setPastedImg] = useState([]);
  const [isEmojiActive, setIsEmojiActive] = useState(false);
  const textInput = useRef();
  const classes = useStyles(isRecording);
  const dispatch = useDispatch();
  const {
    auth_user,
    active_user,
    quote,
    userMessages,
    isNightMode,
    searchText,
  } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_user: store.chat.active_user || {},
      tempMsg: store.message.tempMessages || [],
      quote: store.app.quoteData || {},
      userMessages: store.message.userMessages || [],
      isNightMode: store.app.mode || false,
      searchText: store.app.searchText || "",
    };
  });
  // clear typed messages when chat window changes
  useEffect(() => {
    setMessage("");
  }, [active_user]);
  // focus input field when page in load
  useEffect(() => {
    if (searchText.length < 1 && textInput.current) {
      textInput.current.focus();
    }
  }, [active_user, quote]);
 
  useEffect(() => {
    if (message.length > 0) {
      typing();
    }
    if (message.length < 1) {
      leaveTyping();
    }
  }, [message]);
  const typing = () => {
    const paramData = {
      user_id: active_user?.elsemployees_empid,
      tPerson: auth_user?.elsemployees_empid,
      name: auth_user.elsemployees_name,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("typing", paramData);
  };
  const leaveTyping = () => {
    const paramData = {
      user_id: active_user?.elsemployees_empid,
      tPerson: auth_user?.elsemployees_empid,
      name: active_user.elsemployees_name,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("leaveTyping", paramData);
  };
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: true,
  });
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
  const deleteAttachment = (index) => {
    attachment.splice(index, 1);
    setAttachment([...attachment]);
  };
  // function to set to default
  const setToDefault = () => {
    if (textInput.current) {
      textInput.current.innerHTML = "";
    }
    setMessage("");
    setIsEmojiActive(false);
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
  console.log(status)

  const SendMessage = async () => {
    setToDefault();
    let blob = await fetch(mediaBlobUrl).then(r => r.blob())
    const file =  new File([blob], "file name.wav", {type:blob.type});``
    setRecording(false)
    const messageParams = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
        message_to: active_user?.elsemployees_empid,
        message_body: message || null,
        message_to: active_user?.elsemployees_empid,
        message_quoteid: quote?.message_id || null,
        message_quotebody: quote?.message_body || null,
        message_quoteuser: quote?.from_username || null,
        message_attachment: file || "",
      },
    };
    messageParams.data = Utils.getFormData(messageParams.data);
    await dispatch(sendMessage(messageParams))
      .then((res) => {
        setScrollDown(res);
        const attachments = res.data.data.message_attachment;
        const socketParams = {
          message_originalname: auth_user?.elsemployees_name,
          user_id: auth_user?.elsemployees_empid,
          message_to: active_user?.elsemployees_empid,
          message_body: message,
          from_userpicture: auth_user?.elsemployees_image,
          message_quoteid: quote?.message_id || null,
          message_quotebody: quote?.message_body || null,
          message_quoteuser: quote?.from_username || null,
          message_attachment: attachments || null,
          message_id: Date.now(),
          fullTime: moment().format("Y-MM-D, h:mm:ss"),
          messageOn: "user",
        };

        const socket = getSocket(auth_user?.elsemployees_empid);
        socket.emit("messaging", socketParams);
        dispatch(setUserMessages([res.data?.data, ...userMessages]));
        const getContactsParams = {
          data: {
            loginuser_id: auth_user.elsemployees_empid,
            user_id: auth_user.elsemployees_empid,
          },
        };
        dispatch(getContactsUser(getContactsParams));
      })
      .catch((err) => console.warn(err));
  };

  const onEmojiClick = (event) => {
    setMessage(`${message}${event.native}`);
    textInput.current.innerText = `${message}${event.native}`;
  };

  const Emoji = () => {
    return (
      <div style={{ position: "absolute", bottom: "100%", left: "0" }}>
        <Picker onSelect={onEmojiClick} native={true} />
      </div>
    );
  };
  const handleStartRecording = () => {
    startRecording();
    setRecording(true);
  };
  const handleStopRecording = () => {
    stopRecording();
  };
  const InputField = () => {
    return (
      <Box display="flex" style={{ width: "100%" }}>
        <div className="inputField__container">
          <div
            className="qoutMsg__container"
            style={{
              background: isNightMode ? DARKLIGHT : "#eeee",
              color: isNightMode ? "#fff" : "#000",
            }}
          >
            <IconButton
              style={{ position: "absolute", top: "1%", left: "0%" }}
              onClick={() => {
                setIsEmojiActive(!isEmojiActive);
              }}
            >
              <EmojiEmotionsIcon
                color={isEmojiActive ? "primary" : "inherit"}
              />
            </IconButton>
            {quote.message_body ? (
              <div>
                <p className="qcMsg">
                  {quote.attachment ? "Attachment" : quote.message_body}
                </p>
                <p className="qcName">{quote.from_username}</p>
                <IconButton
                  style={{ position: "absolute", top: "1%", right: "0%" }}
                  onClick={() => {
                    dispatch(setQuote(null));
                  }}
                >
                  <CloseIcon color="primary" />
                </IconButton>
              </div>
            ) : null}
            {isEmojiActive && <Emoji />}

            <div
              className="inputField"
              ref={textInput}
              onKeyUp={(e) => {
                setMessage(e.target.innerText);
              }}
              onPasteCapture={(e) => {
                setPastedImg(e.clipboardData.files);
              }}
              onBlur={leaveTyping}
              data-placeholder={"Type a Message"}
              contentEditable={true}
              spellCheck={true}
            />
          </div>
        </div>
        <div className="audio__container">
          <IconButton onClick={handleStartRecording}>
            <MicIcon />
          </IconButton>
        </div>
      </Box>
    );
  };
  return (
    <div
      className="inputAttachContainer"
      style={
        attachment.length
          ? {
              background: isNightMode ? DARKLIGHT : "#eee",
              height: "40vh",
            }
          : null
      }
    >
      <div className="attachmentPreview">
        {attachment ? AttachmentPreview : null}
      </div>
      <div onKeyDown={SendMessageOnEnter} className="messageInput">
        <div className="inputContainer">
          {!isRecording ? (
            <InputField />
          ) : (
            <Recorder onCancelVoice={handleStopRecording} />
          )}
          {message.length > 0 ||
          attachment.length > 0 ||
          pastedImg.length > 0 ||
          isRecording ? (
            <IconButton onClick={SendMessage} className={classes.sendBtn}>
              <SendIcon style={{ color: "red !important" }} />
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
