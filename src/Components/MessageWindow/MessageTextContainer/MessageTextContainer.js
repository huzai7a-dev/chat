import React, { useEffect, createRef, useState } from "react";
import "./MessageTextContainer.css";
import { useDispatch, useSelector } from "react-redux";
import UserMessage from "./UserMessage/UserMessage";
import { Avatar, Paper, } from "@material-ui/core";
import { getMoreUserMessages, getUserMessages } from "../../../api/message";
import _ from 'lodash';
import moment from "moment";
import Typography from '@material-ui/core/Typography';
import loading from '../../../Assets/loading.gif';
import { DARKLIGHT } from "../../../Theme/colorConstant";
import InfiniteScroll from 'react-infinite-scroll-component';
import { setUserMessages } from "../../../Redux/actions/message";
import CircularProgress from "@material-ui/core/CircularProgress";
import { mergeArray } from "../../../helper/util";
function MessageTextContainer({scrollDown}) {
  const [hasMore,setHasMore] = useState(true);
  const { auth_user, active_user, userMessages, isTyping, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_user: store.chat.active_user || {},
      userMessages: store.message.userMessages || [],
      isTyping: store.chat?.isTyping || {},
      isNightMode: store.app.mode || false
    };
  });
  useEffect(()=>{
    setHasMore(true)
  },[active_user])
  
  const dispatch = useDispatch();
  const image = active_user?.elsemployees_image;
  const messageContainer = createRef();
  const params = {
    data: {
      from_id: auth_user?.elsemployees_empid,
      to_id: active_user?.elsemployees_empid,
      user_id: auth_user?.elsemployees_empid,
    },
  };

  useEffect(() => {
    dispatch(getUserMessages(params));
  }, [active_user]);

  //function to always scroll on bottom
  const scrollToBottom = () => {
    const scroll =
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  }, [active_user,scrollDown]);
  // if there is no message this component will render
  const NoChat = () => {
    return (
      <div className="noChat">
        {image ? <Avatar style={{ width: "60px", height: "60px" }} color="primary"
          src={`/bizzportal/public/img/${image}`}
        /> : <Avatar style={{ width: "60px", height: "60px" }} color="primary">{active_user?.elsemployees_name[0]}</Avatar>}

        <Typography variant="h5" color={isNightMode ? "primary" : "textSecondary"}>{active_user?.elsemployees_name}</Typography>
      </div>
    )
  }
  const fetchMoreMessages = async() => {
    
    const lastMsgId = userMessages[userMessages.length-1].message_id
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
        message_id: lastMsgId
      }
    }
    const response = await dispatch(getMoreUserMessages(params));
    const olderMessages = response.data.messages;
    if (olderMessages.length <1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(userMessages,olderMessages,"message_id");
    dispatch(setUserMessages(mergedArray));
  }
  const ModifiedMessages = () => {
    const groupedByMessages = _.chain(userMessages)
      // Group the elements of Array based on `date` property
      .groupBy((m) => {
        return moment(m.fullTime).calendar({
          sameDay: '[Today]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: 'dddd',
          sameElse: 'DD/MM/YYYY'
        });
      })
      // `key` is group's name (date), `value` is the array of objects
      .reduce((result, value, key) => { 
        result[key] = value;
        return result;
      }, {})
      .value()
    return (
      <InfiniteScroll
        dataLength={userMessages.length}
        next={fetchMoreMessages}
        inverse={true} 
        hasMore={hasMore}
        loader={<div style={{textAlign:"center"}}><CircularProgress /></div>}
        scrollableTarget="scrollableDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
    {Object.keys(groupedByMessages)?.map((key, id) => {
      const groupedByMessage = groupedByMessages[key];
      return (
        <div key={id} >
            <div className="dividerContainer" >
              <div className="divider" style={{ background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)" }} />
              <Typography variant="body2" align="center" color={isNightMode ? "primary" : "textSecondary"} style={{ padding: "0px 5px" }}>{key}</Typography>
              <div className="divider" style={{ background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            {
              groupedByMessage?.map((message) => (
                <UserMessage sender={message} key={message?.message_id} />
                ))
              }
              </div>
          </div>
        )})}
    </InfiniteScroll>
    )
  }

  const Typing = () => {
    return (
      <Paper elevation={0} style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="caption" color="textSecondary">{isTyping.data?.name} is Typing  </Typography>
        <img src={loading} alt="Loading" height="40px" width="40px" className="loading" />
      </Paper>
    )
  }
  return (
    <div className="messageTextContainer" ref={messageContainer} id="scrollableDiv" style={{ display: "flex", flexDirection: "column-reverse" }}>
      {userMessages.length === 0 ? (
        <NoChat />
      ) : (
        <>
          <ModifiedMessages />
          <div className="typing">
            {
              isTyping?.data?.tPerson == active_user?.elsemployees_empid && isTyping.status ? <Typing /> : null
            }
          </div>
        </>
      )}
    </div>
  );
}

export default MessageTextContainer;
