import { Box, makeStyles, Typography, Avatar, Button } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import React from "react";
import {
  PRIMARYLIGHT,
  PRIMARYMAIN,
  SECONDARYDARK,
  SECONDARYMAIN,
} from "../../../Theme/colorConstant";
import moment from 'moment'
const useStyles = makeStyles((theme) => ({
  message: {
    alignSelf: (props) =>
      props.message.message_to == props.toId ? "end" : "start",
    flexDirection: (props) =>
      props.message.message_to == props.toId && "row-reverse",
    display: "flex",
  },
  messageBody: {
    width: "420px",
    height: "auto",
    padding: "10px",
    whiteSpace: "pre-wrap",
    borderRadius: props => props.message?.message_quotebody !== "null" ? "0px 0px 10px 10px" :"10px",
    background: (props) =>
      props.message.message_to == props.toId ? SECONDARYDARK : PRIMARYLIGHT,
      wordWrap: "break-word",
  },
  quotedMessageBody: {
    width: "420px",
    background: SECONDARYMAIN,
    borderRadius:"10px 10px 0px 0px",
    height: "auto",
    padding: "10px",
  },
}));

function Message(props) {
  const classes = useStyles(props);

  const RenderSendAttachment = () => {
    const attachments = props.message.message_attachment;
    return attachments.split(",").map((attachment, id) => {
      const DownloadButton = () => {
        return (
          <Button variant="outlined" size="small" color={"primary"} key={id}>
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
      <Box>
        <Box style={{marginTop:"10px",padding:"0px 5px"}}>
          <Typography variant="caption">{moment(props.message.fullTime).format('lll')}</Typography>
        {props.message.message_forwarded == 1 && <Typography variant="caption">Forwarded</Typography>}
        </Box>
        {props.message?.message_attachment !== null ? (
          <div className="sentAttachment" style={attachmentStyle}>
            <RenderSendAttachment />
          </div>
        ) : null}
        {props.message?.message_quotebody !== "null" && (
          <Box className={classes.quotedMessageBody}>
            <Typography variant="caption" color="textSecondary">{props.message.message_quotebody}</Typography>
          </Box>
        )}
        {props.message.message_body !== null && (
          <Box className={classes.messageBody}>
            <Typography variant="caption">{props.message.message_body}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Message;
