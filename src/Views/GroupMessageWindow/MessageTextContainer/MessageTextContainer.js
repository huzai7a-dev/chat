import React, { useEffect, useRef, useState, useCallback } from "react";
import "./MessageTextContainer.css";
import UserMessage from "./UserMessage/UserMessage";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import { getGroupMessages, getMoreGroupMessages } from "../../../api/message";
import { setGroupMemInfo } from "../../../Redux/actions/chat";
import _ from "lodash";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { BLACK, DARKLIGHT, WHITE } from "../../../Theme/colorConstant";
import { setGroupMessages } from "../../../Redux/actions/message";
import { mergeArray } from "../../../helper/util";
const MessageTextContainer = React.memo(({ scrollDown }) => {
  const {
    auth_user,
    active_group,
    groupMessages,
    groupMemInfo,
  } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      groupMessages: store.message.groupMessages.messages || [],
      groupMessageData: store.message.groupMessages || {},
      groupMemInfo: store.chat.groupMemInfo || {},
      isNightMode: store.app.mode || false,
    };
  });
  const dispatch = useDispatch();
  const messageContainer = useRef();
  const [alertMessage, setAlertMessage] = useState(false);
  
  useEffect(() => {
    const params = {
      data: {
        group_id: active_group?.group_id,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getGroupMessages(params));
  }, [active_group, auth_user?.elsemployees_empid, dispatch]);
  
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
    if (groupMemInfo.event) {
      setAlertMessage(true);
      setTimeout(function () {
        setAlertMessage(false);
        dispatch(setGroupMemInfo({}));
      }, 3000);
    }
  }, [dispatch, groupMemInfo]);
  //function to always scroll on bottom
  const scrollToBottom = useCallback(() => {
    const scroll =
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [scrollDown, active_group, scrollToBottom]);
  // if there is not message


  return (
    <div
      className="messageTextContainer"
      ref={messageContainer}
      id="scrollableDiv"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {alertMessage ? MemberAlert() : null}
      {groupMessages.length === 0 ? <NoChat /> : <Messages />}
    </div>
  );
});

const Messages = React.memo(() => {
  const [hasMore, setHasMore] = useState(true);
  const {
    auth_user,
    active_group,
    groupMessages,
    isNightMode,
    groupMessageData,
  } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      groupMessages: store.message.groupMessages.messages || [],
      groupMessageData: store.message.groupMessages || {},
      isNightMode: store.app.mode || false,
    };
  });

  const dispatch = useDispatch();

  const fetchMoreMessages = useCallback(async () => {
    const lastMsgId = groupMessages[groupMessages.length - 1].groupmessage_id;
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
        groupmessage_id: lastMsgId,
        group_id: active_group?.group_id,
      },
    };

    const response = await dispatch(getMoreGroupMessages(params));
    const olderMessages = await response.data.messages;
    if (olderMessages.length < 1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(
      groupMessages,
      olderMessages,
      "groupmessage_id"
    );
    dispatch(setGroupMessages({ ...groupMessageData, messages: mergedArray }));
  }, [
    active_group?.group_id,
    auth_user?.elsemployees_empid,
    dispatch,
    groupMessageData,
    groupMessages,
  ]);

  useEffect(() => {
    if(active_group) {
      setHasMore(true);
    }
  }, [active_group]);

  const groupedByMessages = _.chain(groupMessages)
    // Group the elements of Array based on `date` property
    .groupBy((m) => {
      return moment(m.fullTime).calendar({
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        nextWeek: "dddd",
        lastDay: "[Yesterday]",
        lastWeek: "dddd",
        sameElse: "DD/MM/YYYY",
      });
    })
    // `key` is group's name (date), `value` is the array of objects
    .reduce((result, value, key) => {
      result[key] = value;
      return result;
    }, {})
    .value();

  return (
    <InfiniteScroll
      dataLength={groupMessages.length}
      next={fetchMoreMessages}
      inverse={true}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      }
      scrollableTarget="scrollableDiv"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {Object.keys(groupedByMessages)?.map((key, id) => {
        const groupedByMessage = groupedByMessages[key];
        let headMessage = groupedByMessage[0];
        let tailMessage = groupedByMessage[0];

        return (
          <div key={id} className="message_with_date_contaier">
            <div className="dividerContainer">
              <div
                className="divider"
                style={{
                  background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)",
                }}
              />
              <Typography
                variant="body2"
                align="center"
                style={{ padding: "0px 5px", color: isNightMode ? WHITE: BLACK }}
              >
                {key}
              </Typography>
              <div
                className="divider"
                style={{
                  background: isNightMode ? DARKLIGHT : "rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
              {groupedByMessage?.map((message, messageIndex) => {

                if (headMessage.from_userid != message.from_userid || moment(headMessage.fullTime).diff(moment(message.fullTime), 'm') > 1) {
                  headMessage = message
                }

                groupedByMessage?.slice(messageIndex)?.every((nextMessage, nextIndex) => {
                  if(message.from_userid != nextMessage?.from_userid) {
                    return false;
                  }
                  if (moment((nextMessage[nextIndex - 1] || message)?.fullTime).diff(moment(nextMessage?.fullTime), 'm') <= 1) {
                    tailMessage = nextMessage
                    return true
                  }
                })
                
                return (
                <UserMessage
                  chatgroup={message}
                  key={message.groupmessage_id}
                  showDate={
                    groupedByMessage[groupedByMessage.length - 1]
                      .groupmessage_id === message.groupmessage_id
                  }
                  head={headMessage}
                  tail={tailMessage}
                />
              )})}
            </div>
          </div>
        );
      })}
    </InfiniteScroll>
  );
});

const NoChat = React.memo(() => {
  const { active_group, isNightMode } = useSelector((store) => {
    return {
      active_group: store.chat.active_group || {},
      isNightMode: store.app.mode || false,
    };
  });

  const img = active_group?.group_image;
  return (
    <div className="noChat">
      {img ? (
        <Avatar
          style={{ width: "60px", height: "60px" }}
          src={`/api/bwccrm/storage/app/public/chat_attachments/${img}`}
        />
      ) : (
        <Avatar style={{ width: "60px", height: "60px" }}>
          {active_group.group_name?.toUpperCase()[0]}
        </Avatar>
      )}
      <Typography style={{color: isNightMode ? WHITE : BLACK}}>
        Welcome To {`${active_group?.group_name}'s`} Group
      </Typography>
    </div>
  );
});

export default MessageTextContainer;
