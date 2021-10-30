import { Avatar, Typography, Button, Paper } from "@material-ui/core";
import React, { useState, useRef, useCallback, } from "react";
import "./userMessage.css";
import { useDispatch, useSelector } from "react-redux";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CancelIcon from "@material-ui/icons/Cancel";
import Modal from "react-modal";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { useOutsideAlerter } from "../../../../hooks/useOutsideClick";
import { setQuote } from "../../../../Redux/actions/app";
import moment from 'moment';
import ForwardMessage from "../ForwardMessage";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { DARKLIGHT } from "../../../../Theme/colorConstant";
function UserMessage(props) {
  const { auth_user, active_user,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || { },
      // contacts: store.message.contacts.contacts || [],
      active_user: store.auth.auth_user || { },
      isNightMode:store.app.mode || false
    };
  });
  const [forwardModel, setForwardModel] = useState(false)

  const dispatch = useDispatch();
  const loggedInUser = auth_user?.elsemployees_empid;
  const image = props.sender.from_userpicture;
  const attachments = props.sender.message_attachment;
  const [openModel, setOpenModel] = useState(false);
  const [media, setMedia] = useState("");
  const [option, setOption] = useState(false);
  const menuDiv = useRef();
  const onClickOutside = useCallback((e) => {
    setOption(false);
  }, []);
  
  useOutsideAlerter(menuDiv, onClickOutside);
  const forwardMessageParams = {
    data: {
      user_id: auth_user?.elsemployees_empid,
      loginuser_id: auth_user?.elsemployees_empid,
      message_to: "",
      message_body: props.sender.message_body || null,
      message_to: active_user?.elsemployees_empid,
      message_quoteid: props.sender?.message_quoteid || null,
      message_quotebody: props.sender?.message_quotebody || null,
      message_quoteuser: props.sender?.message_quoteuser || null,
      message_attachment: props.sender.message_attachment,
      message_forwarded: 1,
      message_originalname: props.sender.message_originalname || null,
    }
  }
  //function to render sent attachment
  const RenderSendAttachment = () => {
    return attachments.split(",").map((attachment, id) => {
      const DownloadButton = () => {
        return (
          <Button variant="outlined" size="small" color={"primary"}>
            <a
              href={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
              download={attachment}
              className="anchorText"
            >
              Download
            </a>
          </Button>
        );
      };
      const splitAttachment = attachment.split(".");
      const attachmentType = splitAttachment[splitAttachment.length - 1];
      if (
        attachmentType.toLowerCase() === "jpg" ||
        attachmentType.toLowerCase() === "gif" ||
        attachmentType.toLowerCase() === "png" ||
        attachmentType.toLowerCase() === "jpeg"
      ) {
        return (
          <div className="attachView" key={id}>
            <img
              onClick={(e) => {
                openImage(e);
              }}
              height="auto"
              width="150px"
              src={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
              alt="attachment"
            />
          </div>
        );
      }
      if (
        attachmentType.toLowerCase() === "mp4" ||
        attachmentType.toLowerCase() === "mkv" ||
        attachmentType.toLowerCase() === "wmv" ||
        attachmentType.toLowerCase() === "flv"
      ) {
        return (
          <div className="attachView" key={id}>
            <video
              height="auto"
              width="150px"
              src={`/api/bwccrm/storage/app/public/chat_attachments/${attachment}`}
              alt="attachments"
              controls
            />
          </div>
        );
      } else {
        const fileName = props.sender.message_originalname.split(",")[id];
        return (
          <div className="attachView" key={id}>
            <div className="file">
              <FileCopyIcon />
              <Typography variant="caption">{fileName}</Typography>
              <DownloadButton />
            </div>
          </div>
        );
      }
    });
  };
  // function to open image/video
  const openImage = (e) => {
    setMedia(e.target.src);
    setOpenModel(true);
  };
  // function to collect data for quote messages
  const quoteData = () => {
    const quoteMsg = {
      from_username: props.sender.from_username,
      message_body:
        props.sender.message_attachment || props.sender.message_body,
      message_id: props.sender.message_id,
      attachment: props.sender.message_attachment,
    };
    dispatch(setQuote(quoteMsg));
    setOption(false);
  };
  const attachmentStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:
      props.sender.message_from === loggedInUser ? "flex-end" : "flex-start",
    alignItems: "center",
  };
  const downloadAttachment = (file) => {
    const attachList = file.split(",");
    attachList.forEach((attachment) => {
      const anchor = document.createElement("a");
      anchor.href = `/api/bwccrm/storage/app/public/chat_attachments/${attachment}`;
      anchor.download = attachment;
      anchor.click();
    });
  };

  const QuotedMessage = () => {
    return (
      <>
        {props.sender.message_quotebody !== "null" ? (
          <a
            className="sendQuotedMsg"
            href={"#" + props.sender.message_quoteid}
            style={{
              borderBottom:
                props.sender.message_from === loggedInUser ? "1px solid #000" : "none",
            }}
          >
            <p className="qName">{props.sender.message_quoteuser}</p>
            <p className="qMsg">{props.sender.message_quotebody}</p>
          </a>
        ) : null}
      </>
    );
  };
  const AttachmentModel = () => {
    const imgStyle = {
      width: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
      display: "block",
      height: "auto",
    };
    return (
      <Modal
        isOpen={openModel}
        onRequestClose={() => {
          setOpenModel(false);
        }}
        className="mediaModel"
        >
        
        <div className="mediaContainer">
          {props.sender.message_attachment ? (
            <TransformWrapper>
            <TransformComponent>
              <img alt="Attachment" src={media} style={imgStyle} />
            </TransformComponent>
          </TransformWrapper>
          ) : null}
          <CancelIcon
            className="modelCutIcon"
            onClick={() => {
              setOpenModel(false);
            }}
          />
        </div>
      </Modal>
    );
  };
  const MessageOptions = () => {
    return (
      <div className="optionsContainer">
        <div className="options">
          <p onClick={() => { setForwardModel(true) }}>Forward</p>
          <p onClick={quoteData}>Quote</p>
          {props.sender.message_attachment ? (
            <p
              onClick={() =>
                downloadAttachment(props.sender.message_attachment)
              }
            >
              Download
            </p>
          ) : null}
        </div>
      </div>
    );
  };
  const messageToBackground = isNightMode ? DARKLIGHT : "##f0f4f8";

  return (
    <div
      id={props.sender.message_id}
      className={
        props.sender.message_from !== loggedInUser ? "senderMessage " : "userMessage"
      }
    >
      <div className="userMessage__picture">
        {props.sender.message_from !== loggedInUser ? (
          <Avatar src={`/bizzportal/public/img/${image}`} style={{width:"50px",height:"50px"}} />
        ) : null}
      </div>

      <div className="userMessageBox">
        <div
          className={
            props.sender.message_from !== loggedInUser
              ? "senderMessage__details"
              : "userMessage__details"
          }
        >
          <div className="userMessage__name" style={{ marginRight: "5px" }}>
            <p>
              {props.sender.message_from !== loggedInUser
                ? props.sender.from_username+","
                : ""}
            </p>
          </div>

          <div
            className="userMessage__time"
            style={{ display: "flex", alignItems: "center" }}
          >
            <p>{moment(props.sender.fullTime).format("LT")}</p>
          </div>

          <div
            className="msgOption"
            ref={menuDiv}
            onClick={() => {
              setOption(!option);
            }}
          >
            <MoreVertIcon />
            {option ? <MessageOptions /> : null}
          </div>
        </div>
        {
          parseInt(props.sender.message_forwarded) == 1 ? 
            <Typography variant="caption" color={isNightMode ? "primary": "textSecondary"}>Forwarded</Typography>
         : null
        }
        
        {/* {props.sender?.message_attachment !== null ? (
          <div className="sentAttachment" style={attachmentStyle}>
            <RenderSendAttachment />
          </div>
        ) : null} */}
        
        {props.sender.message_body && props.sender.message_body !== "null"  ? (
          <div className="recieverQoutMsg__container">
            {props.sender.message_quotebody ? <QuotedMessage /> : null}
            <div
              style={{background: props.sender.message_from !== loggedInUser ? "#d8ecf7" : messageToBackground, color:isNightMode && props.sender.message_from == loggedInUser ? "#fff": "rgb(37, 36, 35)"}}
              className={
                props.sender.message_from !== loggedInUser
                  ? "senderMessage__text"
                  : "recieverMessage__text"
              }
            >

              {props.sender.message_body}
            </div>
            <div
              style={{ position: "absolute", right: "0", fontSize: ".2rem" }}
            >
              {props.sender.seen > 0 && props.sender.message_from == loggedInUser ? (
                <DoneAllIcon fontSize="small" color="primary" />
              ) : null}
            </div>
          </div>
        ) : null}
        <AttachmentModel />
        <Modal
          isOpen={forwardModel}
          onRequestClose={() => { setForwardModel(false) }}
          className="forwardModel"
        >
          <ForwardMessage
            setForwardModel={setForwardModel}
            params={forwardMessageParams}
          />
        </Modal>
      </div>
    </div>
  );
}

export default UserMessage;
