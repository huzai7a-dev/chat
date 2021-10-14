import { Box, makeStyles, Typography, Avatar,Button } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import React from "react";
import {
  PRIMARYLIGHT,
  PRIMARYMAIN,
  SECONDARYDARK,
} from "../../../Theme/colorConstant";

const useStyles = makeStyles((theme) => ({
  message: {
    alignSelf: (props) =>
      props.message.message_to == props.toId ? "end" : "start",
    flexDirection:(props)=> props.message.message_to == props.toId && "row-reverse",
    display: "flex",
  },
  messageBody: {
    width: "420px",
    background: (props) =>
      props.message.message_to == props.toId ? SECONDARYDARK : PRIMARYLIGHT,
    height: "auto",
    margin: "10px 0px",
    padding: "10px",
    whiteSpace: "pre-wrap",
    borderRadius: "10px",
  },
}));

function Message(props) {
  const classes = useStyles(props);


  const RenderSendAttachment = () => {
      const attachments = props.message.message_attachment
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
        const fileName = props.message.message_originalname.split(",")[id];
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
  const attachmentStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:
      props.message.message_from === props.toId ? "flex-start" : "flex-end",
    alignItems: "center",
  };

  return (
    <Box className={classes.message}>
      <Avatar
        src={`/bizzportal/public/img/${props.message.from_userpicture}`}
      />
      {props.message?.message_attachment !== null ? (
          <div className="sentAttachment" style={attachmentStyle}>
            <RenderSendAttachment />
          </div>
        ) : null}
      {props.message.message_body !== null && (
        <Box className={classes.messageBody}>
          <Typography>{props.message.message_body}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Message;
