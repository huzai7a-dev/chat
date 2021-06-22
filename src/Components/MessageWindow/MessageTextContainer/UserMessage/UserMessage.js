import { Avatar, Button } from "@material-ui/core";
import React, { useState, useRef, useCallback } from "react";
import "./userMessage.css";
import { useDispatch, useSelector } from "react-redux";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CancelIcon from "@material-ui/icons/Cancel";
import { quote } from "../../../../Redux/Action";
import Modal from "react-modal";
import axios from "axios";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { useOutsideAlerter } from "../../../../hooks/useOutsideClick";
function UserMessage(props) {
  const data = useSelector((state) => {
    return state;
  });
 
  const dispatch = useDispatch();
  const admin = data.Auth.data?.elsemployees_empid;
  const image = props.sender.from_userpicture;
  const attachments = props.sender.message_attachment;
  const [openModel, setOpenModel] = useState(false);
  const [media, setMedia] = useState("");
  const [option, setOption] = useState(false);
  const menuDiv = useRef();
  const onClickOutside = useCallback(e => {
    setOption(false)
  }, [])

  useOutsideAlerter(menuDiv,onClickOutside);

  //function to render sent attachment
  const RenderSendAttachment = () => {
    return attachments.split(",").map((attachment, id) => {
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
        return (
          <div className="attachView" key={id}>
            <div className="file">
              <FileCopyIcon />
              <h4>{props.sender.message_originalname}</h4>
              <Button color={"primary"}>Download</Button>
            </div>
          </div>
        );
      }
    });
  };
  // function to open image/video on open
  const openImage = (e) => {
    setMedia(e.target.src);
    setOpenModel(true);
  };
  // function to collect data for quote mesgs
  const quoteData = () => {

    const quoteMsg = {
      from_username: props.sender.from_username,
      message_body: props.sender.message_attachment || props.sender.message_body,
      message_id: props.sender.message_id,
      attachment: props.sender.message_attachment,
    };
    dispatch(quote(quoteMsg));
    setOption(false);
  };
  
  const downloadAttachment = (file) =>{
    const attachList = file.split(",")
    attachList.forEach((attachment)=>{
      const anchor = document.createElement("a");
      anchor.href = `/api/bwccrm/storage/app/public/chat_attachments/${attachment}` ;
      anchor.download = attachment;
      anchor.click()
    })
  }
  return (
    <div
      id={props.sender.message_id}
      className={
        props.sender.message_from !== admin ? "senderMessage " : "userMessage"
      }
    >
      <div className="userMessage__picture">
        {props.sender.message_from !== admin ? (
          <Avatar src={`/bizzportal/public/img/${image}`} />
        ) : (
          ""
        )}
      </div>

      <div className="userMessageBox">
        <div
          className={
            props.sender.message_from !== admin
              ? "senderMessage__details"
              : "userMessage__details"
          }
        >
          <div className={"userMessage__name"}>
            <p>
              {props.sender.message_from !== admin
                ? props.sender.from_username
                : ""}
            </p>
          </div>

          <div
            className="userMessage__time"
            style={{ display: "flex", flex: "1", marginLeft: "5px" }}
          >
            <p>{props.sender.fullTime}</p>
          </div>

          <div
            className="msgOption"
            ref={menuDiv}
            onClick={() => {
              setOption(!option);
            }}
          > 
            <MoreVertIcon />
            {option ? (
            <div
              className="optionsContainer"
            >
              <div className="options">
                <p onClick={quoteData}>Quote</p>
                {props.sender.message_attachment ? (<p onClick={()=> downloadAttachment(props.sender.message_attachment)}>Donwload</p>): null}
              </div>
            </div>
          ) : (
            null
          )}
          </div>
        </div>
        {props.sender.message_attachment ? (
          <div
            className="sentAttachment"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                props.sender.message_from === admin ? "flex-end" : "flex-start",
              alignItems:"center"
            }}
          >
            <RenderSendAttachment />
          </div>
        ) : (
          null
        )}
        
        {props.sender.message_body ? (
          <div className="recieverQoutMsg__container">
            {props.sender.message_quotebody !== "null" ? (
              <a
                className="sendQuotedMsg"
                href={"#"+props.sender.message_quoteid}
                style={{
                  borderBottom:
                    props.sender.message_from === admin
                      ? "1px solid #000"
                      : "none",
                }}
              >
                <p className="qName">{props.sender.message_quoteuser}</p>
                <p className="qMsg">{props.sender.message_quotebody}</p>
              </a>
            ) : (
              null
            )}
            <div
              className={
                props.sender.message_from !== admin
                  ? "senderMessage__text"
                  : "recieverMessage__text"
              }
            >
              {props.sender.message_body }
            </div>
            <div style={{position:"absolute", right:"0", fontSize:".2rem"}}>
            {props.sender.seen > 0 && props.sender.message_from == admin ? (<DoneAllIcon fontSize="small" color="primary" />) : null} 
            </div>
          </div>
        ) : (
          null
        )}
        <Modal
          isOpen={openModel}
          onRequestClose={() => {
            setOpenModel(false);
          }}
          className="mediaModel"
        >
          <div className="mediaContainer">
            {props.sender.message_attachment ? (
              <img
                alt="Attachment"
                src={media}
                style={{ height: "auto", width: "auto" }}
              />
            ) : (
              null
            )}
            <CancelIcon
              className="modelCutIcon"
              onClick={() => {
                setOpenModel(false);
              }}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UserMessage;
