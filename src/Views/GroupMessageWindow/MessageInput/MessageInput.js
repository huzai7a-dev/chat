import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import "./groupMessage.css";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import { Box, IconButton, LinearProgress, makeStyles, Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
// import { getSocket } from "../../../socket";
import { setQuote } from "../../../Redux/actions/app";
import Utils, {
  filterList,
  getFileFromBlob,
} from "../../../helper/util";
import { sendGroupMessage } from "../../../api/message";
import {
  getGroupParticipants,
  getUserGroups,
  seenGroupMessage,
} from "../../../api/chat";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { setGroupMessages } from "../../../Redux/actions/message";
import { BLACK, DARKLIGHT, DARKMAIN, LIGHT, PRIMARYLIGHT, PRIMARYMAIN, WHITE } from "../../../Theme/colorConstant";
import MicIcon from "@material-ui/icons/Mic";
import { useReactMediaRecorder } from "react-media-recorder";
// import Recorder from "../../Recorder/Recorder";
// import User from "../../User/User";
import Recorder from "../../../Components/Recorder/Recorder";
import User from "../../../Components/AdminPanel/User";
import { getSocket } from "../../../config/socket";
import { useOutsideAlerter } from '../../../hooks/useOutsideClick';
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
});

function MessageInput({
  inputProps,
  attachment,
  open,
  setAttachment,
  setScrollDown,
}) {
  const classes = useStyles();
  const {
    auth_user,
    active_group,
    quote,
    groupMessages,
    isNightMode,
    searchText,
    sideBarCollapsed,
  } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      quote: store.app.quoteData || {},
      groupMessages: store.message.groupMessages || {},
      isNightMode: store.app.mode || false,
      searchText: store.app.searchText || "",
      sideBarCollapsed: store.app.sideBarCollapsed || false,
    };
  });

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      echoCancellation: true,
    });
  const [isEmojiActive, setIsEmojiActive] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const textInput = useRef();
  const dispatch = useDispatch();
  const [pastedImg, setPastedImg] = useState([]);
  const [visibleAudio, setVisibleAudio] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState([]);
  const [progress, setProgress] = useState(0)

  const menuDiv = useRef();
  const onClickOutside = useCallback(() => {
    setIsEmojiActive(false);
  }, []);

  useOutsideAlerter(menuDiv, onClickOutside);

  const onEmojiSelect = useCallback((event) => {
    const text = event.target?.textContent || event.target?.innerText || "";
    textInput.current.innerText = `${text}${event.native}`
  }, []);

  const getParticipants = useCallback(async () => {
    const params = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        group_id: active_group?.group_id,
      },
    };
    const response = await dispatch(getGroupParticipants(params));
    setParticipants(response.data?.participants);
    setShowParticipants(true);
  }, [active_group?.group_id, auth_user?.elsemployees_empid, dispatch]);

  const deleteAttachment = useCallback(
    (index) => {
      attachment.splice(index, 1);
      setAttachment([...attachment]);
    },
    [attachment, setAttachment]
  );

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
    });
  }, [attachment, deleteAttachment]);
  // focus input field when page in load
  useEffect(() => {
    if (searchText.length < 1 && textInput?.current) {
      textInput.current?.focus();
    }
  }, [active_group, quote, searchText.length]);

  const setToDefault = useCallback(() => {
    if (textInput.current) {
      textInput.current.innerHTML = "";
    }
    setVisibleAudio(false);
    setRecording(false);
    setIsEmojiActive(false);
    setAttachment([]);
    setPastedImg([]);
    dispatch(setQuote(null));
  }, [dispatch, setAttachment]);

  const handleStartRecording = () => {
    startRecording();
    setRecording(true);
  };

  const handleCancelVoice = () => {
    stopRecording();
    setVisibleAudio(false);
    setRecording(false);
  };
  const handleStopVoice = () => {
    stopRecording();
    setVisibleAudio(true);
  };

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
    const attachmentFile = await userAttachment();
    const messageParams = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
        group_id: active_group?.group_id,
        message_body: textInput.current?.textContent || textInput.current?.innerText || "",
        message_quoteid: quote?.message_id || null,
        message_quotebody: quote?.groupmessage_body || null,
        message_quoteuser: quote.from_username || null,
        message_attachment: attachmentFile || null,
      },
      onUploadProgress: (progressEvent) => {
        setProgress(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      },
    };
    messageParams.data = Utils.getFormData(messageParams.data);
    try {
      const res = await dispatch(sendGroupMessage(messageParams))
      setProgress(0)
      setScrollDown(res);
      dispatch(
        setGroupMessages({
          ...groupMessages,
          messages: [res.data.data, ...groupMessages.messages],
        })
      );
      const seenParams = {
        data: {
          group_id: active_group.group_id,
          user_id: auth_user?.elsemployees_empid,
        },
      };
      dispatch(seenGroupMessage(seenParams)).then(() => {
        const getGroupParams = {
          data: {
            loginuser_id: auth_user?.elsemployees_empid,
            user_id: auth_user?.elsemployees_empid,
          },
        };
        dispatch(getUserGroups(getGroupParams));
      });

      const attachments = res.data.data.groupmessage_attachment;
      const socketParams = {
        from_username: auth_user?.elsemployees_name,
        from_userpicture: auth_user?.elsemployees_image,
        user_id: auth_user?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
        group_id: active_group?.group_id,
        group_name: active_group?.group_name,
        message_body: textInput.current?.textContent || textInput.current?.innerText || "",
        message_id: Date.now(),
        fullTime: moment().format("Y-MM-D, h:mm:ss"),
        message_quoteid: res.data.quote ? res.data.quote?.message_id : null,
        message_quotebody: res.data.quote
          ? res.data.quote?.groupmessage_body
          : null,
        message_quoteuser: res.data.quote
          ? res.data.quote?.from_username
          : null,
        messageOn: "group",
        groupmessage_attachment: attachments || null,
      };

      const socket = getSocket(auth_user?.elsemployees_empid);
      socket.emit("group-messaging", socketParams);
    }
    catch (err) {
      setProgress(0);
      console.warn(err)
    }
    setToDefault();
  }, [
    active_group.group_id,
    active_group?.group_name,
    auth_user?.elsemployees_empid,
    auth_user?.elsemployees_image,
    auth_user?.elsemployees_name,
    dispatch,
    groupMessages,
    quote.from_username,
    quote?.groupmessage_body,
    quote?.message_id,
    setScrollDown,
    setToDefault,
    userAttachment,
  ]);

  const Emoji = (onEmojiClick) => {
    return (
      <div style={{ position: "absolute", bottom: "100%", left: "0" }}>
        <Picker onSelect={onEmojiClick} native={true} />
      </div>
    );
  };

  const mentionUser = (e) => {
    if (e.target.innerText[0] === "@" || e.target.innerText.includes(" @")) {
      getParticipants();
    } else {
      setShowParticipants(false);
    }
  };

  const selectMentionUser = (user) => {
    const span = document.createElement("span");
    span.innerText = user.elsemployees_name;
    textInput.current.appendChild(span);
  };
  return (
    <div
      className="inputAttachContainer"
      style={
        attachment.length
          ? {
            background: isNightMode ? DARKMAIN : LIGHT,
            height: "40vh",
            width: sideBarCollapsed ? "100%" : "calc(100% - 350px)",
          }
          : { width: sideBarCollapsed ? "100%" : "calc(100% - 350px)" }
      }
    >
      <div className="attachmentPreview">
        {attachment ? AttachmentPreview : null}
      </div>
      <div onKeyDown={SendMessageOnEnter} className="messageInput">
        {progress ? <LinearProgress value={progress} style={{ width: "100%", margin: "1rem 0px" }} /> : null}
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
                  {quote.groupmessage_body && (
                    <div>
                      <p className="qcMsg">
                        {quote.attachment
                          ? "Attachment"
                          : quote.groupmessage_body}
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
                        <CloseIcon />
                      </IconButton>
                    </div>
                  )}
                  {showParticipants && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "0",
                      }}
                    >
                      {participants
                        .filter((v) =>
                          filterList(v.elsemployees_name, (textInput.current?.textContent || textInput.current?.innerText || "").substring(1))
                        )
                        .map((user) => (
                          <User
                            onClick={() => selectMentionUser(user)}
                            key={user.elsemployees_empid}
                            userName={user.elsemployees_name}
                            userImage={user.elsemployees_image}
                          />
                        ))}
                    </div>
                  )}
                  {isEmojiActive && <Emoji />}
                  <div
                    className="inputField"
                    ref={textInput}
                    onPasteCapture={(e) => {
                      setPastedImg(e.clipboardData.files);
                    }}
                    onKeyUp={mentionUser}
                    data-placeholder={"Type a Message"}
                    contentEditable={true}
                    spellCheck={true}
                  // onBlur={leaveTyping}
                  />
                  <IconButton
                    ref={menuDiv}
                    style={{ position: "absolute", top: "1%", left: "0%" }}
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
