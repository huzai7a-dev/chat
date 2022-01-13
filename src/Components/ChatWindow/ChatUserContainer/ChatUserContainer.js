import React, { useEffect, useState, useCallback, useRef } from "react";
import ChatUser from "./ChatUser/ChatUser";
import "./chatUserContainer.css";
import { WHITE, SECONDARYMAIN } from "../../../Theme/colorConstant";
import { useDispatch, useSelector } from "react-redux";
import ChatGroup from "./ChatGroup/ChatGroup";

import { Button, Box, Typography, Badge } from "@material-ui/core";
import SearchedUser from "./SearchedUser/SearchedUser";
import { getContactsUser, getUserGroups, seenMessage } from "../../../api/chat";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import AppUser from "../../Utils/AppUser/AppUser";
import { useHistory, useParams } from "react-router-dom";
import { setActiveChat, setHeaderData } from "../../../Redux/actions/chat";
import { profile_url } from "../../../constants/apiConstants";
import { setGallery } from "../../../Redux/actions/message";
import { quote } from "../../../Redux/Action";
import { setSideBar } from "../../../Redux/actions/app";
import { getSocket } from "../../../socket";

function ChatUserContainer({ tabValue, contactsLoaded, groupsLoaded }) {
  const {
    active_user,
    auth_user,
    userSearch,
    searchText,
    contacts,
    groupsList,
  } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
      active_user: store.chat.active_user || {},
      userSearch: store.app?.userSearch || {},
      searchText: store.app?.searchText || "",
      contacts: store.chat?.contacts || [],
      groupsList: store.chat?.groups || [],
      isNightMode: store.app.mode || false,
    };
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const ContactList = React.memo(() => {
    if (!contactsLoaded)
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      );

    const onClickUser = useCallback((user) => {
      history.push(`/user/${user.elsemployees_empid}`);
      dispatch(setActiveChat(user));
      const paramData = {
        message_to: user.elsemployees_empid,
      };
      dispatch(setGallery(false));
      dispatch(quote(null));
      if (window.innerWidth < 700) {
        dispatch(setSideBar(true));
      }
      dispatch(
        setHeaderData({
          activeType: "user",
          activeName: user?.elsemployees_name,
          activeId: user?.elsemployees_empid,
        })
      );
      if (user.unseen == 1) {
        const socket = getSocket(auth_user?.elsemployees_empid);
        socket.emit("seen", paramData);
      }

      if (user.unseen > 0) {
        const seenParams = {
          data: {
            user_id: user?.elsemployees_empid,
            loginuser_id: auth_user?.elsemployees_empid,
          },
        };

        dispatch(seenMessage(seenParams))
          .then(() => {
            const contactParams = {
              data: {
                loginuser_id: auth_user.elsemployees_empid,
                user_id: auth_user.elsemployees_empid,
              },
            };
            const socket = getSocket(auth_user?.elsemployees_empid);
            socket.emit("seen", paramData);
            dispatch(getContactsUser(contactParams));
          })
          .catch((err) => console.warn(err));
      }
    }, []);

    return (
      <div className="chatUserList">
        {contacts?.length > 0 ? (
          contacts.map((contact, id) => (
            <AppUser
              key={contact?.elsemployees_empid}
              userName={contact?.elsemployees_name}
              lastMessage={
                !contact?.last_msg.message_body == "null"
                  ? contact?.last_msg.message_body
                  : "Attachment"
              }
              activeUser={
                active_user?.elsemployees_empid == contact?.elsemployees_empid
              }
              date={moment(contact?.last_msg.created_at).format("LT")}
              handleClick={() => onClickUser(contact)}
              userImage={profile_url + contact?.elsemployees_image}
            />
          ))
        ) : (
          <Typography>No Contacts</Typography>
        )}
      </div>
    );
  });

  function sortedGroup(a, b) {
    if (
      moment(b.groupmessagetime || b.created_at).isAfter(
        a.groupmessagetime || a.created_at
      )
    ) {
      return 1;
    } else {
      return -1;
    }
  }
  const GroupList = React.memo(() => {
    if (!groupsLoaded)
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      );
    return (
      <div className="chatUserList">
        
      </div>
    );
  });
  const SearchedList = React.memo(() => {
    return (
      <div className="searchedUser">
        {userSearch?.map((user, id) => (
          <SearchedUser users={user} key={id} />
        ))}
      </div>
    );
  });
  return (
    <div className="container">
      {/* <SwitchTabs /> */}
      {!searchText ? (
        <div className="chatUserContainer">
          {tabValue == "People" ? <ContactList /> : <GroupList />}
        </div>
      ) : (
        <div className="chatUserContainer">
          <SearchedList />
        </div>
      )}
    </div>
  );
}

export default React.memo(ChatUserContainer);
