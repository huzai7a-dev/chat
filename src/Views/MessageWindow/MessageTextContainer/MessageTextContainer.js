import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import _ from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import { BLACK, DARKLIGHT, WHITE } from "../../../Theme/colorConstant";
import { setUserMessages } from "../../../Redux/actions/message";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserMessage from "./UserMessage/UserMessage";
import { mergeArray } from "../../../helper/util";
import { getMoreUserMessages, getUserMessages } from "../../../api/message";
import "./MessageTextContainer.css";
import InfiniteScroll from "react-infinite-scroll-component";

function MessageTextContainer() {

  const { auth_user, active_user, userMessages, isTyping, isNightMode } = useSelector(
    (store) => {
      return {
        auth_user: store.auth.auth_user || {},
        active_user: store.chat.active_user || {},
        userMessages: store.message.userMessages,
        isNightMode: store.app.mode || false,
        isTyping: store.chat?.isTyping || {},
      };
    }
  );

  const dispatch = useDispatch();
  const messageContainer = useRef();

  useEffect(() => {
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getUserMessages(params));
  }, [active_user, auth_user?.elsemployees_empid, dispatch]);

  //function to always scroll on bottom
  const scrollToBottom = useCallback(() => {
    const scroll =
      messageContainer.current?.scrollHeight -
      messageContainer.current?.clientHeight;
    messageContainer.current?.scrollTo(0, scroll);
  }, []);

  useEffect(() => {
    if (active_user) {
      scrollToBottom()
    }
  }, [scrollToBottom, active_user]);

  if (!userMessages) return <CircularProgress />
  return (
    <>
      <div
        className="messageTextContainer"
        ref={messageContainer}
        id="scrollableDiv"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {userMessages.length === 0 ? (
          <NoChat />
        ) : (
          <Messages />
        )}
      </div>
      {isTyping.data?.tPerson == active_user?.elsemployees_empid && isTyping.status && (
        <div style={{display:"flex", flexDirection: "row", margin: "0.2rem 1rem"}}>
          <Typography variant="caption" color={isNightMode ? "primary" : "textSecondary"}>{`${active_user?.elsemployees_name} is typing `}</Typography>
          <div className="chat__typingLoader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </>
  );
}

// if there is no message this component will render
const NoChat = React.memo(() => {
  const { active_user, isNightMode } = useSelector(
    (store) => {
      return {
        isNightMode: store.app.mode || false,
        active_user: store.chat.active_user || {},
      };
    }
  );
  const image = active_user?.elsemployees_image;
  return (
    <div className="noChat">
      {image ? (
        <Avatar
          style={{ width: "60px", height: "60px" }}
          color="primary"
          src={`/bizzportal/public/img/${image}`}
        />
      ) : (
        <Avatar style={{ width: "60px", height: "60px" }} color="primary">
          {active_user?.elsemployees_name[0]}
        </Avatar>
      )}

      <Typography
        variant="h5"
        color={isNightMode ? "primary" : "textSecondary"}
      >
        {active_user?.elsemployees_name}
      </Typography>
    </div>
  );
});

const Messages = React.memo(() => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const { userMessages, isNightMode, auth_user, active_user } = useSelector(
    (store) => {
      return {
        auth_user: store.auth.auth_user || {},
        active_user: store.chat.active_user || {},
        userMessages: store.message.userMessages || [],
        isNightMode: store.app.mode || false,
      };
    }
  );

  const groupedByMessages = _.chain(userMessages)
    // Group the elements of Array based on `date` property
    .groupBy((m) => {
      return moment(m.fullTime).calendar({
        sameDay: "[Today]",
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

  const fetchMoreMessages = useCallback(async () => {
    const lastMsgId = userMessages[userMessages.length - 1].message_id;
    const params = {
      data: {
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
        message_id: lastMsgId,
      },
    };
    const response = await dispatch(getMoreUserMessages(params));
    const olderMessages = response.data.messages;
    if (olderMessages.length < 1) {
      setHasMore(false);
    }
    const mergedArray = mergeArray(userMessages, olderMessages, "message_id");
    dispatch(setUserMessages(mergedArray));
  }, [
    active_user?.elsemployees_empid,
    auth_user?.elsemployees_empid,
    dispatch,
    userMessages,
  ]);

  useEffect(() => {
    if (active_user) {
      setHasMore(true);
    }
  }, [active_user])

  const renderItem = useMemo(() => Object.keys(groupedByMessages).map((key, id) => {
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
            style={{ padding: "0px 5px", color: isNightMode ? WHITE : BLACK }}
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

            if (headMessage.message_from != message.message_from || moment(headMessage.fullTime).diff(moment(message.fullTime), 'm') > 1) {
              headMessage = message
            }

            groupedByMessage?.slice(messageIndex)?.every((nextMessage, nextIndex) => {
              if (message.message_from != nextMessage?.message_from) {
                return false;
              }
              if (moment((nextMessage[nextIndex - 1] || message)?.fullTime).diff(moment(nextMessage?.fullTime), 'm') <= 1) {
                tailMessage = nextMessage
                return true
              }
            })

            return (
              <UserMessage
                sender={message}
                key={message?.message_id}
                head={headMessage}
                tail={tailMessage}
              />
            )
          })}
        </div>
      </div>
    );

  }), [groupedByMessages, isNightMode])

  return (
    <InfiniteScroll
      dataLength={userMessages.length}
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
      {renderItem}
    </InfiniteScroll>
  );
});

export default React.memo(MessageTextContainer);
