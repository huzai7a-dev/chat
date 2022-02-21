import { Box, makeStyles, Typography, Avatar } from "@material-ui/core";
import React from "react";
import {
  PRIMARYLIGHT,
  SECONDARYDARK,
  SECONDARYMAIN,BLACK,WHITE
} from "../../../Theme/colorConstant";
import moment from 'moment'
import { useSelector} from 'react-redux';
import RenderAttachment from "../../Utils/RenderAttachment";

const useStyles = makeStyles((theme) => ({
  message: {
    alignSelf: (props) =>
      props.message.from_userid == props.toId ? "end" : "start",
    flexDirection: (props) =>
      props.message.from_userid == props.toId && "row-reverse",
    display: "flex",
  },
  messageBody: {
    width: "420px",
    height: "auto",
    padding: "10px",
    whiteSpace: "pre-wrap",
    borderRadius: props => props.message?.groupmessage_quotebody !== "null" ? "0px 0px 10px 10px" :"10px",
    background: (props) =>
      props.message.from_userid == props.toId ? SECONDARYDARK : PRIMARYLIGHT,
      wordWrap: "break-word",
  },
  quotedMessageBody: {
    width: "420px",
    background: SECONDARYMAIN,
    borderRadius:"10px 10px 0px 0px",
    height: "auto",
    padding: "10px",
    wordWrap: "break-word"
  },
}));

function Message(props) {
  const classes = useStyles(props);
  const {isNightMode} = useSelector(store => {
    return {
      isNightMode: store.app.mode
    }
  })
  const attachmentStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:
      props.message.from_userid === props.toId ? "flex-start" : "flex-end",
    alignItems: "center",
  };

  return (
    <Box className={classes.message}>
      <Avatar
        src={`/bizzportal/public/img/${props.message.from_userpicture}`}
      />
      <Box>
        <Box style={{marginTop:"10px",padding:"0px 5px"}}>
          <Typography variant="caption" style={{color: isNightMode ? WHITE: BLACK}}>{moment(props.message.fullTime).format('lll')}</Typography>
        {props.message.groupmessage_forwarded == 1 && <Typography variant="caption">Forwarded</Typography>}
        </Box>
        {props.message?.groupmessage_attachment !== null ? (
          <div className="sentAttachment" style={attachmentStyle}>
            {/* <RenderAttachment /> */}
            <RenderAttachment
              attachments={props.message.groupmessage_attachment}
              fileName={props.message.groupmessage_originalname}
              onOpenImage={ ()=> null}
            />
          </div>
        ) : null}
        {props.message?.groupmessage_quotebody !== "null"  && (
          <Box className={classes.quotedMessageBody}>
            <Typography variant="caption" color="textSecondary">{props.message.groupmessage_quotebody}</Typography>
          </Box>
        )}
        {props.message.groupmessage_body !== null && (
          <Box className={classes.messageBody}>
            <Typography variant="caption">{props.message.groupmessage_body}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Message;
