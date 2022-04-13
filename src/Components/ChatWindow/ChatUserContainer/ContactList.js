import React, { useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, CircularProgress } from "@material-ui/core";
import moment from "moment";
import { getContactsUser, seenMessage } from "../../../api/chat";
import AppUser from "../../Utils/AppUser/AppUser";
import { setActiveChat, setHeaderData } from "../../../Redux/actions/chat";
import { profile_url } from "../../../constants/apiConstants";
import { quote } from "../../../Redux/Action";
import { setSideBar } from "../../../Redux/actions/app";
import { getSocket } from "../../../config/socket";
import InfiniteScroll from "react-infinite-scroll-component";
import "./chatUserContainer.css";

const ContactList = React.memo((props) => {

  const {
    active_user,
    auth_user,
    contacts,
    meta,
  } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
      active_user: store.chat.active_user || {},
      contacts: store.chat.contacts || [],
      meta: store.chat.contactMeta,
    };
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const debounce = useRef(false);

  const onClickUser = (user) => {

    dispatch(setActiveChat(user));
    const paramData = {
      message_to: user.elsemployees_empid,
    };
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
    history.push(`/user/${user.elsemployees_empid}`);
  };

  const fetchMoreContacts = useCallback(async () => {
    if(debounce.current) return;
    debounce.current = true;
    try {
      const params = {
        params: {
          page: meta.current_page + 1,
        },
        data: {
          loginuser_id: auth_user.elsemployees_empid,
          user_id: auth_user.elsemployees_empid,
        },
      }
      await dispatch(getContactsUser(params))
    } catch (e) {
      console.log(e);
    }
    debounce.current = false;
  }, [auth_user, dispatch, meta])

  if (!props.contactsLoaded)
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
    <div id="chat-user-list" className="chatUserList">
      <InfiniteScroll
        dataLength={contacts.length}
        next={fetchMoreContacts}
        hasMore={meta.current_page < meta.last_page}
        scrollableTarget="chat-user-list"
      >
        {contacts?.length > 0 ? (
          contacts.map((contact) => (
            <AppUser
              userId={contact?.elsemployees_empid}
              key={contact?.elsemployees_empid}
              userName={contact?.elsemployees_name}
              lastMessage={
                contact?.last_msg.message_body && contact?.last_msg.message_body !== "null"
                  ? contact?.last_msg.message_body
                  : "Attachment"
              }
              activeUser={
                active_user?.elsemployees_empid == contact?.elsemployees_empid
              }
              date={moment(contact?.last_msg.created_at).format("LT")}
              handleClick={() => onClickUser(contact)}
              userImage={contact?.elsemployees_image}
              path={profile_url}
              unseen={contact.unseen}
            />
          ))
        ) : (
          <Typography>No Contacts</Typography>
        )}
      </InfiniteScroll>
    </div>
  );
});

export default ContactList;