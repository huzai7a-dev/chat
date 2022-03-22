import { Box, makeStyles, Typography, Avatar } from "@material-ui/core";
import React, { useState, useCallback } from "react";
import {
  PRIMARYLIGHT,
  SECONDARYDARK,
  SECONDARYMAIN,
} from "../../../Theme/colorConstant";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { BLACK, WHITE } from "../../../Theme/colorConstant";
import RenderAttachment from "../../Utils/RenderAttachment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deleteMessage } from "../../../api/admin";

const useStyles = makeStyles(() => ({
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
    borderRadius: (props) =>
      props.message?.message_quotebody !== "null"
        ? "0px 0px 10px 10px"
        : "10px",
    background: (props) =>
      props.message.message_to == props.toId ? SECONDARYDARK : PRIMARYLIGHT,
    wordWrap: "break-word",
  },
  quotedMessageBody: {
    width: "420px",
    background: SECONDARYMAIN,
    borderRadius: "10px 10px 0px 0px",
    height: "auto",
    padding: "10px",
  },
}));

function Message(props) {
  const classes = useStyles(props);
  const [option, setOption] = useState(false);
  const dispatch = useDispatch();
  const { isNightMode } = useSelector((store) => {
    return {
      isNightMode: store.app.mode,
    };
  });

  const attachmentStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent:
      props.message.message_from === props.toId ? "flex-start" : "flex-end",
    alignItems: "center",
  };

  const onDeleteMessage = useCallback(async () => {
    try {
      const params = {
        data: {
          message_id: props.message?.message_id
        }
      };
      await dispatch(deleteMessage(params));
      if(props.onUpdate) props.onUpdate()
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, props])

  return (
    <Box className={classes.message}>
      <Avatar
        src={`/bizzportal/public/img/${props.message.from_userpicture}`}
      />
      <Box>
        <Box style={{ marginTop: "10px", padding: "0px 5px" }}>
          <Typography
            variant="caption"
            style={{ color: isNightMode ? WHITE : BLACK }}
          >
            {moment(props.message.fullTime).format("lll")}
          </Typography>
          {props.message.message_forwarded == 1 && (
            <Typography variant="caption">Forwarded</Typography>
          )}
        </Box>
        {props.message?.message_attachment !== null ? (
          <div className="sentAttachment" style={attachmentStyle}>
            <RenderAttachment
              attachments={props.message.message_attachment}
              fileName={props.message.message_originalname}
              onOpenImage={() => null}
            />
          </div>
        ) : null}
        {props.message?.message_quotebody !== "null" && (
          <Box className={classes.quotedMessageBody}>
            <Typography variant="caption" color="textSecondary">
              {props.message.message_quotebody}
            </Typography>
          </Box>
        )}
        {props.message.message_body !== null && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box className={classes.messageBody}>
              <Typography variant="caption">
                {props.message.message_body}
              </Typography>
            </Box>
            <div
              className="msgOption"
              style={option ? { display: "flex", position:'relative' } : null}
              onClick={() => {
                setOption((o) => !o);
              }}
            >
              <MoreVertIcon />
              {option ? (
                <div
                  className="optionsContainer"
                  style={{
                    [props.message.message_from !== props.toId
                      ? "right"
                      : "left"]: "100%",
                  }}
                >
                  <div className="options">
                    <p
                      onClick={onDeleteMessage}
                    >
                      Delete
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}

export default Message;
