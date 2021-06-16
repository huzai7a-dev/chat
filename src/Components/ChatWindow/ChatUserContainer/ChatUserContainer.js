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
import {
  updateGroup,
  upDateUser,
} from "../../../Redux/Action";
import moment from "moment";

function ChatUserContainer() {
  const data = useSelector((state) => {
    return state;
  });
  const [people, setPeople] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    return axios
      .post("/api/bwccrm/getContactsUser", {
        loginuser_id: data.Auth.data?.elsemployees_empid,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(upDateUser(res.data.contacts));
      });
  }, []);

  useEffect(() => {
    return axios
      .post("/api/bwccrm/getUserGroups", {
        loginuser_id: data.Auth.data?.elsemployees_empid,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(updateGroup(res.data));
      })
      .catch((err) => {
        console.warn("group error", err);
      });
  }, []);

  const handleTab = (event, newValue) => {
    setTabValue(newValue);
  };
  const changePeopleTab=()=>{
    setPeople(true)
    axios // contact user api call when tab is changed
      .post("/api/bwccrm/getContactsUser", {
        loginuser_id: data.Auth.data.elsemployees_empid,
        user_id: data.Auth.data.elsemployees_empid,
      })
      .then((res) => {
        dispatch(upDateUser(res.data.contacts));
      })
    
  }
  const changeGroupTab=()=>{
    setPeople(false)
    axios // group api call when tab is changed
      .post("/api/bwccrm/getUserGroups", {
        loginuser_id: data.Auth.data?.elsemployees_empid,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        dispatch(updateGroup(res.data));
      })
      .catch((err) => {
        console.warn("group error", err);
      });
  }
  //sorting list according to time
  const sorting = (a, b) => {
    if (moment(a.groupmessagetime).isBefore(b.groupmessagetime)) {
      return 1;
    }
    else {
      return -1
    }
}
  return (
    <div className="container">
      {!data.searchData ? (
        <div className="chatUserContainer">
          <Paper  style={{ height:"35px", borderRadius:"3px", margin:"10px"}}>
            <Tabs
              indicatorColor="primary"
              value={tabValue}
              onChange={handleTab}
            >
              <Tab
                label="People"
                onClick={changePeopleTab}
              />
              <Tab

                label="Groups"
                onClick={changeGroupTab}
              />
            </Tabs>
          </Paper>

          {people ? (
            <div className="chatUserList">
              {!data.upDateUser.last_msg
                ? data.upDateUser.map((item, id) => (
                    <ChatUser users={item} key={id} />
                  ))
                : "NO CHATS ARE AVAILABLE"}
            </div>
          ) : (
            <div className="groupList">
              {data.updateGroup.sort(sorting).map((list, id) => {
                return <ChatGroup groups={list} key={id} />;
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="searchedUser">
          {data.UserSearch.map((user, id) => {
            return <SearchedUser users={user} key={id} />;
          })}
        </div>
      )}
    </div>
  );
}

export default ChatUserContainer;
