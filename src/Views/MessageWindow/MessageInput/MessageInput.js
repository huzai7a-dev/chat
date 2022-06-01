import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
// import { getSocket } from "../../../socket";
import { getContactsUser } from "../../../api/chat";
import { sendMessage } from "../../../api/message";
import Utils, { getFileFromBlob } from "../../../helper/util";
import { setUserMessages } from "../../../Redux/actions/message";
import { DARKLIGHT, DANGER, PRIMARYLIGHT, PRIMARYMAIN, BLACK, WHITE, LIGHT } from "../../../Theme/colorConstant";
import { useReactMediaRecorder } from "react-media-recorder";
import Tooltip from "@material-ui/core/Tooltip";
import Recorder from "../../../Components/Recorder/Recorder";
import { getSocket } from "../../../config/socket";
import LinearProgress from '@material-ui/core/LinearProgress';
// import Recorder from "../../Recorder/Recorder";

// textInput.current.textContent || textInput.current.innerText || "";

const useStyles = makeStyles({
  sendBtn: {
    width: "50px",
    height: "50px",
    background: PRIMARYMAIN,
    color: WHITE,
    borderRadius: "50%",
    fontSize: "10px",
    transition: ".3s",
    "&:hover": {
      background: PRIMARYLIGHT,
      color: PRIMARYMAIN,
    },
  },
  attachBtn: {
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: PRIMARYMAIN,
    color: WHITE,
    borderRadius: "50%",
    fontSize: "10px",
    transition: ".3s",
    "&:hover": {
      background: PRIMARYLIGHT,
      color: PRIMARYMAIN,
    },
  },
  micIcon: {
    color: DANGER,
  },
});
function MessageInput({ inputProps, attachment, open, setAttachment }) {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      echoCancellation: true,
    });

  const [isRecording, setRecording] = useState(false);
  const [pastedImg, setPastedImg] = useState([]);
  const [isEmojiActive, setIsEmojiActive] = useState(false);
  const [visibleAudio, setVisibleAudio] = useState(false);
  const [progress, setProgress] = useState(0);
  const [debounce, setDebounce] = useState(false);
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

  const typing = useCallback(() => {
    const paramData = {
      user_id: active_user?.elsemployees_empid,
      tPerson: auth_user?.elsemployees_empid,
      name: auth_user.elsemployees_name,
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("typing", paramData);
  }, [
    active_user?.elsemployees_empid,
    auth_user?.elsemployees_empid,
    auth_user.elsemployees_name,
  ]);

  const leaveTyping = useCallback(() => {
    const paramData = {
      user_id: active_user?.elsemployees_empid,
      tPerson: auth_user?.elsemployees_empid,
      name: active_user.elsemployees_name,
      msgQty: (textInput.current?.textContent || textInput.current?.innerText || "")?.trim(),
    };
    const socket = getSocket(auth_user?.elsemployees_empid);
    socket.emit("leaveTyping", paramData);
  }, [
    active_user?.elsemployees_empid,
    active_user.elsemployees_name,
    auth_user?.elsemployees_empid,
  ]);

  const deleteAttachment = useCallback(
    (index) => {
      attachment.splice(index, 1);
      setAttachment([...attachment]);
    },
    [attachment, setAttachment]
  );

  // clear typed messages when chat window changes
  useEffect(() => {
    if (textInput.current) {
      textInput.current.innerText = "";
    }

    const onPaste = (e) => {
      e.preventDefault()
      if(e.clipboardData?.files?.length) {
        setAttachment(a => [...a, ...e.clipboardData?.files])
      } else {
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
      }
    }

    if (textInput.current) {
      const el = textInput.current;
      el?.addEventListener('paste', onPaste);
      return () => {
        el?.removeEventListener('paste', onPaste)
      }
    }
  }, [active_user, setAttachment]);

  // focus input field when page in load
  useEffect(() => {
    if (searchText.length < 1 && textInput.current) {
      textInput.current.focus();
    }
  }, [active_user, quote, searchText.length]);

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
    });
  }, [attachment, deleteAttachment]);

  // function to set to default
  const setToDefault = useCallback(() => {
    if (textInput.current) {
      textInput.current.innerHTML = "";
    }
    setRecording(false);
    setVisibleAudio(false);
    setIsEmojiActive(false);
    setAttachment([]);
    setPastedImg([]);
    dispatch(setQuote(null));
  }, [dispatch, setAttachment]);

  // send message on enter
  const SendMessageOnEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const message = e.target?.textContent || e.target?.innerText || "";
      if (message.length > 0 || attachment.length > 0 || pastedImg.length > 0) {
        SendMessage();
      }
    }
  };
  const userAttachment = useCallback(async () => {
    if (attachment.length > 0) {
      return attachment;
    } else if (pastedImg.length > 0) {
      return pastedImg;
    } else if (mediaBlobUrl) {
      const file = await getFileFromBlob(mediaBlobUrl);
      return file;
    } else {
      return null;
    }
  }, [attachment, mediaBlobUrl, pastedImg]);
  const SendMessage = useCallback(async () => {
    if(debounce) return;
    setDebounce(true);
    const attachmentFile = await userAttachment();
    const messageParams = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
        message_to: active_user?.elsemployees_empid,
        message_body: textInput.current?.textContent || textInput.current?.innerText || "",
        message_quoteid: quote?.message_id || null,
        message_quotebody: quote?.message_body || null,
        message_quoteuser: quote?.from_username || null,
        message_attachment: attachmentFile || "",
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      },
    };
    messageParams.data = Utils.getFormData(messageParams.data);
    try {
      const res = await dispatch(sendMessage(messageParams))
      // setScrollDown(res);
      setProgress(0)
      const attachments = res.data.data.message_attachment;
      const socketParams = {
        message_originalname: auth_user?.elsemployees_name,
        user_id: auth_user?.elsemployees_empid,
        message_to: active_user?.elsemployees_empid,
        message_body: textInput.current?.textContent || textInput.current?.innerText || "",
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
    }
    catch (err) {
      setProgress(0);
      console.warn(err);
    }
    setToDefault();
    setDebounce(false);
  }, [
    active_user?.elsemployees_empid,
    auth_user,
    dispatch,
    quote,
    setToDefault,
    userAttachment,
    userMessages,
    debounce,
  ]);

  const onEmojiSelect = useCallback((event) => {
    const text = event.target?.textContent || event.target?.innerText || "";
    textInput.current.innerText = `${text}${event.native}`
  }, []);

  const onChangeMessage = (e) => {
    const text = (e.target?.textContent || e.target?.innerText || "")?.trim();
    if (text.length > 0) {
      typing();
    } else {
      leaveTyping();
    }
  }

  const Emoji = React.memo(() => {
    return (
      <div style={{ position: "absolute", bottom: "100%", left: "0" }}>
        <Picker showPreview={false} onSelect={onEmojiSelect} native={true} />
      </div>
    );
  }, []);

  const handleStartRecording = useCallback(() => {
    startRecording();
    setRecording(true);
  }, [startRecording]);

  const handleCancelVoice = useCallback(() => {
    stopRecording();
    setVisibleAudio(false);
    setRecording(false);
  }, [stopRecording]);

  const handleStopVoice = useCallback(() => {
    stopRecording();
    setVisibleAudio(true);
  }, [stopRecording]);

  return (
    <div
      className="inputAttachContainer"
      style={
        attachment.length
          ? {
            background: isNightMode ? DARKLIGHT : LIGHT,
            height: "40vh",
          }
          : {  }
      }
    >
      <div className="attachmentPreview">{attachment && AttachmentPreview}</div>
      <div onKeyDown={SendMessageOnEnter} className="messageInput">
        {progress ? (<LinearProgress value={progress} style={{ width: "100%", margin: "1rem 0" }} />) : null}
        <div className="inputContainer">
          {visibleAudio && <audio src={mediaBlobUrl} controls />}
          {!isRecording ? (
            <Box display="flex" style={{ width: "100%" }}>
              <div className="inputField__container">
                <div
                  className="qoutMsg__container"
                  style={{
                    background: isNightMode ? DARKLIGHT : LIGHT,
                    color: isNightMode ? WHITE : BLACK,
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
                        {quote.message_body ? quote.message_body : "Attachment"}
                      </p>
                      <p className="qcName">{quote.from_username}</p>
                      <IconButton
                        style={{
                          position: "absolute",
                          top: "1%",
                          right: "0%",
                        }}
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
                    onKeyUp={onChangeMessage}
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
                <Tooltip title="Record Voice">
                  <IconButton onClick={handleStartRecording}>
                    <MicIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Box>
          ) : (
            <Recorder
              onCancelVoice={handleCancelVoice}
              onStopVoice={handleStopVoice}
              onPlayVoice={startRecording}
              status={status}
            />
          )}
          {(textInput.current?.textContent || textInput.current?.innerText || "").length > 0 ||
            attachment.length > 0 ||
            pastedImg.length > 0 ||
            (isRecording && status !== "recording") ? (
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
