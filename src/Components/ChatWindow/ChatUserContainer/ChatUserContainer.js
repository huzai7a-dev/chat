import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography, CircularProgress } from "@material-ui/core";
import moment from "moment";
import SearchedUser from "./SearchedUser/SearchedUser";
import { getContactsUser, getUserGroups, seenGroupMessage } from "../../../api/chat";
import AppUser from "../../Utils/AppUser/AppUser";
import { setActiveGroup, setHeaderData } from "../../../Redux/actions/chat";
import { attachments_url } from "../../../constants/apiConstants";
import { setSideBar } from "../../../Redux/actions/app";
import { getSocket } from "../../../config/socket";
import "./chatUserContainer.css";
import ContactList from "./ContactList";
// import { getSocket } from "";

const ChatUserContainer = React.memo(({ tabValue }) => {
  const {
    auth_user,
    userSearch,
    searchText,
    active_group,
    groups
  } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
      active_group:store.chat.active_group||{}, 
      userSearch: store.app?.userSearch || [],
      searchText: store.app?.searchText || "",
      groups:store.chat.groups|| [],
    };
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const [contactsLoaded,setcontactsLoaded] = useState(false)
  const [groupsLoaded,setGroupsLoaded] = useState(false)
  const getContactList = useCallback(async ()=> {
    const params = {
      data: {
        loginuser_id: auth_user.elsemployees_empid,
        user_id: auth_user.elsemployees_empid,
      },
    };
    await dispatch(getContactsUser(params));
    setcontactsLoaded(true)
  },[auth_user.elsemployees_empid, dispatch])

  useEffect(()=>{
    getContactList()
  },[auth_user.elsemployees_empid, dispatch, getContactList])

  const getGroupList = useCallback(async()=>{
      const params = {
        data: {
          loginuser_id: auth_user?.elsemployees_empid,
          user_id: auth_user?.elsemployees_empid,
        },
      };
      await dispatch(getUserGroups(params));
      setGroupsLoaded(true)
  },[auth_user?.elsemployees_empid, dispatch])

  useEffect(()=>{
    getGroupList()
  },[getGroupList])

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
    const onClickGroup=(group)=>{
      history.push(`/group/${group.group_id}`);
      dispatch(setActiveGroup(group));
    if (window.innerWidth < 700) {
      dispatch(setSideBar(true));
    }
    dispatch(
      setHeaderData({
        activeType: "group",
        activeName: group.group_name,
        activeId: group.group_id,
        other: {
          membersLength: group?.memberid.split("").length,
        },
      })
    );
    
    const seenParams = {
      data: {
        group_id: group.group_id,
        user_id: auth_user?.elsemployees_empid,
      },
    };

    if (group?.groupunseenmesg) {
      dispatch(seenGroupMessage(seenParams)).then(() => {
        const socketParams = {
          group_id: active_group.group_id,
          user_id: auth_user?.elsemployees_empid,
          info: "real time seen",
        };
        const socket = getSocket(auth_user?.elsemployees_empid);
        socket.emit("group-seen", socketParams);
        const params = {
          data: {
            loginuser_id: auth_user?.elsemployees_empid,
            user_id: auth_user?.elsemployees_empid,
          },
        };
        dispatch(getUserGroups(params));
      });
    }
    }

    const renderLastMessageText = useCallback((group) => {
      if(group.lastmessage !== "null" && group.lastmessage ) {
        return group.lastmessage
      } else if(group?.attachment) {
        return "Attachment"
      } else if(parseInt(group.created_by) == parseInt(auth_user.elsemployees_empid)) {
        return "You created this group";
      } else {
        return "Be the first to initiate conversation";
      }
    }, [])

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
        {groups?.length > 0 ? (
          groups.sort(sortedGroup).map((group) => (
            <AppUser
              key={group?.group_id}
              userName={group?.group_name}
              lastMessage={renderLastMessageText(group)}
              activeUser={
                active_group?.group_id == group?.group_id
              }
              date={moment(group?.groupmessagetime || group?.updated_at).format("LT")}
              handleClick={() => onClickGroup(group)}
              userImage={group?.group_image}
              path={attachments_url}
              unseen={group.groupunseenmesg}
            />
          ))
        ) : (
          <Typography>No Contacts</Typography>
        )}
      </div>
    );
  });

  const renderSearchList = useMemo(() => {
    return (
      <div className="searchedUser">
        {userSearch?.map((user, id) => (
          <SearchedUser users={user} key={id} />
        ))}
      </div>
    );
  }, [userSearch]);

  return (
    <div className="container">
      {/* <SwitchTabs /> */}
      {!searchText ? (
        <div className="chatUserContainer">
          {tabValue == "People" ? <ContactList contactsLoaded={contactsLoaded} /> : <GroupList />}
        </div>
      ) : (
        <div className="chatUserContainer">
          {renderSearchList}
        </div>
      )}
    </div>
  );
});

export default ChatUserContainer;
