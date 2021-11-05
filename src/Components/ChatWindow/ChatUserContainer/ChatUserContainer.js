import React, { useEffect, useState,useCallback,useRef } from "react";
import ChatUser from "./ChatUser/ChatUser";
import "./chatUserContainer.css";
import {WHITE,SECONDARYMAIN} from '../../../Theme/colorConstant'
import { useDispatch, useSelector } from "react-redux";
import ChatGroup from "./ChatGroup/ChatGroup";

import {Button,Box} from "@material-ui/core";
import SearchedUser from "./SearchedUser/SearchedUser";
import { getContactsUser, getUserGroups } from "../../../api/chat";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import { Badge } from "@material-ui/core";

function ChatUserContainer() {
  const { auth_user, userSearch, searchText, contacts, groupsList } =
    useSelector((store) => {
      return {
        auth_user: store.auth?.auth_user || {},
        userSearch: store.app?.userSearch || {},
        searchText: store.app?.searchText || "",
        contacts: store.chat?.contacts || [],
        groupsList: store.chat?.groups || [],
        isNightMode:store.app.mode || false
      };
    });

 
  const [tabValue, setTabValue] = useState("People");
  const dispatch = useDispatch();
   const tabRef = useRef();
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
  }, [auth_user, dispatch]);

  
  const changePeopleTab = useCallback(() => {
    setTabValue("People");
    const params = {
      data: {
        loginuser_id: auth_user.elsemployees_empid,
        user_id: auth_user.elsemployees_empid,
      },
    };
     dispatch(getContactsUser(params));
  },[auth_user.elsemployees_empid, dispatch]);

  const changeGroupTab = useCallback(() => {
    setTabValue("Groups");
    const params = {
      data: {
        loginuser_id: auth_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getUserGroups(params));
  },[auth_user?.elsemployees_empid, dispatch]);
  
  const SwitchTabs = React.memo(()=>{
    const allPeopleUnseenMessages = contacts.reduce((acc, curr, ) => {
      return acc + curr.unseen
    }, 0)
    const allGroupsUnseenMessages = groupsList.reduce((acc,curr)=>{
      return acc + curr.groupunseenmesg
    },0)
    const title = {
      people:"People",
      groups:"Groups",
    }
    
    return (
      <Box display="flex" justifyContent="space-between" style={{margin: "5px 10px 0px 10px",height:"30px"}}>
      <Button onClick={changePeopleTab} ref={tabRef} className="tabBtn" style={{background:tabValue == title.people ? WHITE:SECONDARYMAIN}}>
        {title.people}
        {
          allPeopleUnseenMessages > 0 && <Badge badgeContent={allPeopleUnseenMessages} color="primary" style={{marginLeft:"20px",padding:"0px"}}/>
        }
        
      </Button>
      <Button onClick={changeGroupTab} ref={tabRef} className="tabBtn" style={{background:tabValue == title.groups ? WHITE:SECONDARYMAIN}}>
        {title.groups}
        {
          allGroupsUnseenMessages > 0 && <Badge badgeContent={allGroupsUnseenMessages} color="primary" style={{marginLeft:"20px",padding:"0px"}}/>
        }
      </Button>
      </Box>
    )
  })
  
  const ContactList = React.memo(() => {
    return (
      <div className="chatUserList">
        
        {contacts?.length > 0 ? (
          contacts.map((item, id) => <ChatUser users={item} key={id} />)
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </div>
        )}
        
      </div>
    );
  });
  function sortedGroup(a,b){
    if (moment(b.groupmessagetime || b.created_at).isAfter(a.groupmessagetime || a.created_at)) {
      return 1
    }else {
      return -1
    }
} 
  const GroupList = React.memo(() => {
    return (
      <div className="chatUserList">
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
      <SwitchTabs />
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
