import React, { useEffect, createRef, useState } from "react";
import "./MessageTextContainer.css";
import UserMessage from "./UserMessage/UserMessage";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import { getGroupMessages, getMoreGroupMessages } from "../../../api/message";
import { setGroupMemInfo } from "../../../Redux/actions/chat";
import _ from "lodash";
import moment from "moment";
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import { DARKLIGHT } from "../../../Theme/colorConstant";
import { setGroupMessages } from "../../../Redux/actions/message";
import { mergeArray } from "../../../helper/util";
function MessageTextContainer({scrollDown}) {
  const { auth_user, active_group, groupMessages, groupMemInfo, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      groupMessages: store.message.groupMessages.messages || [],
      groupMemInfo: store.chat.groupMemInfo || {},
      isNightMode: store.app.mode || false,
    };
  });

  const dispatch = useDispatch();
  const img = active_group?.group_image;
  const messageContainer = createRef();
  const [alertMessage, setAlertMessage] = useState(false);
  const [hasMore, setHasMore] = useState(true)
  useEffect(() => {
    const params = {
      data: {
        group_id: active_group?.group_id,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getGroupMessages(params));
  }, [active_group]);
  useEffect(()=>{
    setHasMore(true)
  },[active_group])
  const MemberAlert = () => {
    return (
      <Alert
        severity="info"
        style={{
          position: "fixed",
          left: "50%",
          textAlign: "center",
        }}
      >
        {groupMemInfo.member_name} has been {groupMemInfo.event}
      </Alert>
    );
  };
  useEffect(() => {
    // const hasObj = Object.keys(groupMemInfo).length;

    if (groupMemInfo.event) {
      setAlertMessage(true);
      setTimeout(function () {
        setAlertMessage(false);
        dispatch(setGroupMemInfo({}));
      }, 3000);
    }
  }, [groupMemInfo]);
  //function to always scroll on bottom
  const scrollToBottom = () => {
    const scroll =
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  };
  useEffect(() => {
    scrollToBottom();
  }, [scrollDown,active_group]);
  // if there is not message 
  const fetchMoreMessages = async() => {
    
    const lastMsgId = groupMessages[groupMessages.length-1].groupmessage_id
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
        groupmessage_id:lastMsgId,
        group_id: active_group?.group_id,
      }
    }
    
    const response = await dispatch(getMoreGroupMessages(params));
    const olderMessages = response.data.messages;
    if (olderMessages.length <1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(groupMessages,olderMessages,"groupmessage_id");
    
    dispatch(setGroupMessages(mergedArray));
  }

  const Messages = () => {
    const groupedByMessages = _.chain(groupMessages)
      // Group the elements of Array based on `date` property
      .groupBy((m) => {
        return moment(m.fullTime).calendar({
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
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
        dataLength={groupMessages.length}
        next={fetchMoreMessages}
        inverse={true}
        hasMore={hasMore}
        loader={<div style={{ textAlign: "center" }}><CircularProgress /></div>}
        scrollableTarget="scrollableDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {Object.keys(groupedByMessages)?.map((key, id) => {
          const groupedByMessage = groupedByMessages[key];
          
          return (
            <div key={key} >
              <div className="dividerContainer" >
                <div className="divider" style={{ background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)" }} />
                <Typography variant="body2" align="center" color={isNightMode ? "primary" : "textSecondary"} style={{ padding: "0px 5px" }}>{key}</Typography>
                <div className="divider" style={{ background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column-reverse" }}>
                {
                  groupedByMessage?.map((message) => (
                    <UserMessage chatgroup={message} key={message.groupmessage_id} />
                  ))
                }
              </div>
            </div>
          )
        })}
      </InfiniteScroll>
    )
  }



  const NoChat = () => {
    return (
      <div className="noChat">
        {img ? (
          <Avatar
            style={{ width: "60px", height: "60px" }}
            src={`/api/bwccrm/storage/app/public/chat_attachments/${img}`}
          />
        ) : (
          <Avatar style={{ width: "60px", height: "60px" }}>{active_group.group_name?.toUpperCase()[0]}</Avatar>
        )}
        <Typography color={isNightMode ? "primary" : "textSecondary"}>Welcome To {`${active_group?.group_name}'s`} Group</Typography>
      </div>
    )
  }

  return (
    <div className="messageTextContainer" ref={messageContainer} id="scrollableDiv" style={{ display: "flex", flexDirection: "column-reverse" }}>
      {alertMessage ? MemberAlert() : null}
      {groupMessages.length === 0 ? (
        <NoChat />
      ) : (
        
          <Messages />
        
      )}
    </div>
  );
}

export default MessageTextContainer;
