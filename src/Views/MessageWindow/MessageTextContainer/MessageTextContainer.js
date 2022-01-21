import React, { useEffect, createRef, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import { DARKLIGHT } from "../../../Theme/colorConstant";
import { setUserMessages } from "../../../Redux/actions/message";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserMessage from "./UserMessage/UserMessage";
import { mergeArray } from "../../../helper/util";
import { getMoreUserMessages, getUserMessages } from "../../../api/message";
import "./MessageTextContainer.css";
// import { getSocket } from "../../../socket";

function MessageTextContainer() {
  const [hasMore, setHasMore] = useState(true);
  const { auth_user, active_user, userMessages, isNightMode } = useSelector(
    (store) => {
      return {
        auth_user: store.auth.auth_user || {},
        active_user: store.chat.active_user || {},
        userMessages: store.message.userMessages || [],
        isNightMode: store.app.mode || false,
      };
    }
  );
  useEffect(() => {
    setHasMore(true);
  }, [active_user]);

  const dispatch = useDispatch();
  const image = active_user?.elsemployees_image;
  const messageContainer = createRef();

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
      messageContainer.current.scrollHeight -
      messageContainer.current.clientHeight;
    messageContainer.current.scrollTo(0, scroll);
  }, [messageContainer]);

  useEffect(() => {
    scrollToBottom();
  }, [active_user, scrollToBottom]);

  // if there is no message this component will render
  const NoChat = React.memo(() => {
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

  const Messages = React.memo(() => {
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
        {Object.keys(groupedByMessages)?.map((key, id) => {
          const groupedByMessage = groupedByMessages[key];
          let keyMessage = groupedByMessage[0];
          
          return (
            <div key={id}>
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
                  color={isNightMode ? "primary" : "textSecondary"}
                  style={{ padding: "0px 5px" }}
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
                {groupedByMessage?.map((message) => {
                  
                  if (keyMessage.message_from != message.message_from || moment(keyMessage.fullTime).diff(moment(message.fullTime), 'm') > 1) {
                    keyMessage = message
                  }
                  
                  return (
                    <UserMessage
                      sender={message}
                      key={message?.message_id}
                      head={keyMessage}
                    />
                  )
                })}
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
    );
  });

  return (
    <div
      className="messageTextContainer"
      ref={messageContainer}
      id="scrollableDiv"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {userMessages.length === 0 ? (
        <NoChat />
      ) : (
        <>
          <Messages />
        </>
      )}
    </div>
  );
}

export default React.memo(MessageTextContainer);
