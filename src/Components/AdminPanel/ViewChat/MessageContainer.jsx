import { Box, CircularProgress, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMoreUserMessages } from "../../../api/message";
import { mergeArray } from "../../../helper/util";
import {
  setAdminUserMessages,
} from "../../../Redux/actions/message";
import { BLACK, WHITE } from "../../../Theme/colorConstant";
const useStyles = makeStyles(() => ({
  messageContainer: {
    height: "100%",
    overflowY: "auto",
    width: "100%",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column-reverse",
    padding: "0px 20px",
    position:"relative"
  },
  noMessage:{
    position:"absolute",
    top:"50%",
    left:"50%",
    transform:"translate(-50%,-50%)",
  }
}));

function MessageContainer(props) {
  const classes = useStyles();

  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { messages, isNightMode } = useSelector((store) => {
    return {
      messages: store.message.adminUserMessages || [],
      isNightMode: store.message.mode || false,
    };
  });

  const fetchMoreMessages = async () => {
    const lastMsgId = messages[messages.length - 1].message_id;
    const params = {
      data: {
        ...props.messageParams.data,
        message_id: lastMsgId,
      },
    };
    const response = await dispatch(getMoreUserMessages(params));
    const olderMessages = response.data.messages;
    if (olderMessages.length < 1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(messages, olderMessages, "message_id");
    dispatch(setAdminUserMessages(mergedArray));
  };

  return (
    <div id="scrollableDiv" className={classes.messageContainer}>
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreMessages}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
      >
        {messages.length < 1 ? (
           <Typography style={{color: isNightMode ? WHITE: BLACK}} className={classes.noMessage}>No messages between them </Typography>
        ) : (
          messages.map((message) => {
            return (
              <Message
                key={message.message_id}
                message={message}
                toId={props.toId}
              />
            );
          })
        )}
      </InfiniteScroll>
    </div>
  );
}

export default MessageContainer;
