import React, { useEffect, useState } from "react";
import ChatUser from "./ChatUser/ChatUser";
import "./chatUserContainer.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ChatGroup from "./ChatGroup/ChatGroup";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SearchedUser from "./SearchedUser/SearchedUser";
import { getContactsUser, getUserGroups } from "../../../api/chat";
import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import FlipMove from 'react-flip-move';
const useStyles = makeStyles({
  tab: {
    height: "35px",
    borderRadius: "3px",
    margin: "10px",
     background: "#d8ecf7"
  },
});
function ChatUserContainer() {
  const classes = useStyles();
  const { auth_user, userSearch, searchText, contacts, groupsList } =
    useSelector((store) => {
      return {
        auth_user: store.auth?.auth_user || {},
        userSearch: store.app?.userSearch || {},
        searchText: store.app?.searchText || "",
        contacts: store.chat?.contacts || [],
        groupsList: store.chat?.groups || [],
      };
    });

  const [people, setPeople] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth_user) {
      const params = {
        data: {
          loginuser_id: auth_user.elsemployees_empid,
          user_id: auth_user.elsemployees_empid,
        },
      };
      dispatch(getContactsUser(params));
    }
  }, [auth_user]);

  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const changePeopleTab = async () => {
    setPeople(true);
    const params = {
      data: {
        loginuser_id: auth_user.elsemployees_empid,
        user_id: auth_user.elsemployees_empid,
      },
    };
    await dispatch(getContactsUser(params));
  };

  const changeGroupTab = () => {
    setPeople(false);
    const params = {
      data: {
        loginuser_id: auth_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getUserGroups(params));
  };

  const SwitchTabs = () => {
    return (
      <Paper elevation={0} className={classes.tab}>
        <Tabs value={tabValue} onChange={handleTab}>
          <Tab label="People" onClick={changePeopleTab} />
          <Tab label="Groups" onClick={changeGroupTab} />
        </Tabs>
      </Paper>
    );
  };
  const ContactList = () => {
    return (
      <div className="chatUserList">
        
        {contacts?.length > 0 ? (
          <FlipMove>
          {contacts.map((item, id) => <ChatUser users={item} key={id} />)}
          </FlipMove>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

            <CircularProgress />
          
          </div>
        )}
        
      </div>
    );
  };
  function sortedGroup(a,b){
    if (moment(b.groupmessagetime || b.created_at).isAfter(a.groupmessagetime || a.created_at)) {
      return 1
    }else {
      return -1
    }
} 
  
  const GroupList = () => {
    return (
      <div className="groupList">
        {groupsList.length > 0 ? (
          groupsList?.sort(sortedGroup).map((list, id) => {
            return <ChatGroup groups={list} key={id} />;
          })
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  };
  const SearchedList = () => {
    return (
      <div className="searchedUser">
        {userSearch?.map((user, id) => (
          <SearchedUser users={user} key={id} />
        ))}
      </div>
    );
  };
  return (
    <div className="container">
      {!searchText ? (
        <div className="chatUserContainer">
          <SwitchTabs />
          {people ? <ContactList /> : <GroupList />}
        </div>
      ) : (
        <SearchedList />
      )}
    </div>
  );
}

export default ChatUserContainer;
