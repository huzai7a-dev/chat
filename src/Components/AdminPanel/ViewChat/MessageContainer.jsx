import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMoreUserMessages } from "../../../api/message";
import { mergeArray } from "../../../helper/util";
import { setUserMessages } from "../../../Redux/actions/message";

const useStyles = makeStyles(() => ({
  messageContainer: {
    height: "100%",
    overflowY: "auto",
    width: "100%",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column-reverse",
    padding: "0px 20px",
  },
}));

function MessageContainer(props) {
  const classes = useStyles();

  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { messages } = useSelector((store) => {
    return {
      messages: store.message.userMessages || [],
    };
  });

  const fetchMoreMessages = async () => {
    const lastMsgId = messages[messages.length - 1].message_id;
    const params = {
        data:{
            ...props.messageParams.data,
            message_id:lastMsgId
        }
    };
    const response = await dispatch(getMoreUserMessages(params));
    const olderMessages = response.data.messages;
    if (olderMessages.length < 1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(messages, olderMessages, "message_id");
    dispatch(setUserMessages(mergedArray));
  };

  return (
    <div
    id="scrollableDiv"
    className={classes.messageContainer}
  >
    {/*Put the scroll bar always on the bottom*/}
    <InfiniteScroll
      dataLength={messages.length}
      next={fetchMoreMessages}
      style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
      inverse={true} //
      hasMore={hasMore}
      loader={<div style={{textAlign:"center"}}><CircularProgress /></div>}
      scrollableTarget="scrollableDiv"
    >
      {messages.map((message) => {
        return (
          <Message
            key={message.message_id}
            message={message}
            toId={props.toId}
          />
        );
      })}
    </InfiniteScroll>
  </div>
    // <Box className={classes.messageContainer} id="scrollableDiv">
    //   {messages.map((message) => {
    //     return (
    //       <Message
    //         key={message.message_id}
    //         message={message}
    //         toId={props.toId}
    //       />
    //     );
    //   })}
    // </Box>
  );
}

export default MessageContainer;
