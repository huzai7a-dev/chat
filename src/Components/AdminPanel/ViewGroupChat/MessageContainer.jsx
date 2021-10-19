import { makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector,useDispatch } from 'react-redux';
import { getMoreGroupMessages } from '../../../api/message';
import { mergeArray } from '../../../helper/util';
import { setAdminGroupMessages } from '../../../Redux/actions/message';
import Message from './Message';

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
function MessageContainer() {
    const classes = useStyles()
    const { messages,auth_user } = useSelector((store) => {
        return {
            messages: store.message.adminGroupMessages || [],
            auth_user: store.auth.auth_user || {},
        };
    });
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const fetchMoreMessages = async() => {
    
        const lastMsgId = messages[messages.length-1].groupmessage_id
        const params = {
          data: {
            groupmessage_id:lastMsgId,
            group_id: messages[0]?.group_id,
            user_id: auth_user?.elsemployees_empid,
          }
        }
        
        const response = await dispatch(getMoreGroupMessages(params));
        const olderMessages = await response.data.messages;
        if (olderMessages.length <1) {
          setHasMore(false);
        }
        const mergedArray = mergeArray(messages,olderMessages,"groupmessage_id");
        dispatch(setAdminGroupMessages(mergedArray));
      }

    const toId = messages[0].from_userid
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
           <Typography className={classes.noMessage}>No messages between them </Typography>
        ) : (
          messages.map((message) => {
            return (
              <Message
                key={message.groupmessage_id}
                message={message}
                toId={toId}
              />
            );
          })
        )}
      </InfiniteScroll>
        </div>
    )
}

export default MessageContainer
