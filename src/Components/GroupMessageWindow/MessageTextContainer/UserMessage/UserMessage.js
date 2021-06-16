import { Avatar, Button } from "@material-ui/core";
import React, { useState } from "react";
import "./userMessage.css";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CancelIcon from "@material-ui/icons/Cancel";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { quote } from "../../../../Redux/Action";
function UserMessage({ chatgroup }) {
  const data = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const [media, setMedia] = useState("");
  const [option, setOption] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const attachments = chatgroup.groupmessage_attachment;
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
              src={`/bizzportal/public/img/${attachment}`}
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
              <h4>{chatgroup.groupmessage_originalname}</h4>
              <Button color={"primary"}>Download</Button>
            </div>
          </div>
        );
      }
    });
  };
  const image = chatgroup.from_userpicture;
  const admin = data.Auth.data?.elsemployees_empid;
  const user = chatgroup.from_userid;
  // function to open image/video
  const openImage = (e) => {
    setMedia(e.target.src);
    setOpenModel(true);
  };

  // function to get quote data
  const quoteData = () => {
    const quoteMsg = {
      from_username: chatgroup.from_username,
      message_id: chatgroup.message_id,
      groupmessage_body: chatgroup.groupmessage_body,
      attachment: chatgroup.groupmessage_attachment,
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
    <div id={chatgroup.message_id} className={user !== admin ? "senderMessage " : "userMessage"}>
      <div className="userMessage__picture">
        {user !== admin ? (
          <Avatar src={`/bizzportal/public/img/${image}`} />
        ) : (
          ""
        )}
      </div>

      <div className="userMessageBox">
        <div
          className={
            user !== admin ? "senderMessage__details" : "userMessage__details"
          }
        >
          <div className={"userMessage__name"}>
            <p>{user !== admin ? chatgroup.from_username : ""}</p>
          </div>

          <div className="userMessage__time">
            <p>{chatgroup.fullTime}</p>
          </div>

          <div
            className="msgOption"
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
                {chatgroup.groupmessage_attachment ? (<p onClick={()=> downloadAttachment(chatgroup.groupmessage_attachment)}>Donwload</p>): null}
              </div>
            </div>
          ) : (
            null
          )}
          </div>
        </div>
        {chatgroup.groupmessage_attachment ? (
          <div
            className="sentAttachment"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent:
                chatgroup.message_from === admin ? "flex-end" : "flex-start",
              alignItems:"center"
            }}
          >
            <RenderSendAttachment />
          </div>
        ) : (
          null
        )}
        {chatgroup.groupmessage_body ? (
          <div className="recieverQoutMsg__container">
            {chatgroup.groupmessage_quotebody !== "null" ? (
              <a className="sendQuotedMsg" href={"#"+chatgroup.groupmessage_quoteid}>
                <p className="qName">{chatgroup.groupmessage_quoteuser}</p>
                <p className="qMsg">{chatgroup.groupmessage_quotebody}</p>
              </a>
            ) : (
              null
            )}
            <div
              className={
                user !== admin ? "senderMessage__text" : "recieverMessage__text"
              }
            >
              {chatgroup.groupmessage_body}
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
            {chatgroup.groupmessage_attachment ? (
              <img
                alt="Attachment"
                src={media}
                style={{ height: "auto", width: "auto" }}
              />
            ) : (
              ""
            )}
          </div>
          <CancelIcon
            className="modelCutIcon"
            onClick={() => {
              setOpenModel(false);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}

export default UserMessage;
