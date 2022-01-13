import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Box, Typography, Badge } from "@material-ui/core";
import { SECONDARYMAIN, WHITE } from "../../Theme/colorConstant";
import { getContactsUser, getUserGroups } from "../../api/chat";
const SwitchTabs = React.memo(
  ({ tabValue, setTabValue, setContactsLoaded, setGroupsLoaded }) => {
    const tabRef = useRef();
    const dispatch = useDispatch();
    const { auth_user, contacts, groupsList } = useSelector((store) => {
      return {
        auth_user: store.auth?.auth_user || {},
        contacts: store.chat?.contacts || [],
        groupsList: store.chat?.groups || [],
        isNightMode: store.app.mode || false,
      };
    });
    useEffect(() => {
      changePeopleTab();
    }, [auth_user, dispatch]);

    const allPeopleUnseenMessages = contacts.reduce((acc, curr) => {
      return acc + curr.unseen;
    }, 0);
    const allGroupsUnseenMessages = groupsList.reduce((acc, curr) => {
      return acc + curr.groupunseenmesg;
    }, 0);
    const title = {
      people: "People",
      groups: "Groups",
    };

    const changePeopleTab = useCallback(async () => {
      setTabValue("People");
      const params = {
        data: {
          loginuser_id: auth_user.elsemployees_empid,
          user_id: auth_user.elsemployees_empid,
        },
      };
      await dispatch(getContactsUser(params));
      setContactsLoaded(true);
    }, [auth_user.elsemployees_empid, dispatch]);

    const changeGroupTab = useCallback(async () => {
      setTabValue("Groups");
      const params = {
        data: {
          loginuser_id: auth_user?.elsemployees_empid,
          user_id: auth_user?.elsemployees_empid,
        },
      };
      await dispatch(getUserGroups(params));
      setGroupsLoaded(true);
    }, [auth_user?.elsemployees_empid, dispatch]);

    return (
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "5px 10px 0px 10px", height: "30px" }}
      >
        <Button
          onClick={changePeopleTab}
          ref={tabRef}
          className="tabBtn"
          style={{
            background: tabValue == title.people ? WHITE : SECONDARYMAIN,
          }}
        >
          {title.people}
          {allPeopleUnseenMessages > 0 && (
            <Badge
              badgeContent={allPeopleUnseenMessages}
              color="primary"
              style={{ marginLeft: "20px", padding: "0px" }}
            />
          )}
        </Button>
        <Button
          onClick={changeGroupTab}
          ref={tabRef}
          className="tabBtn"
          style={{
            background: tabValue == title.groups ? WHITE : SECONDARYMAIN,
          }}
        >
          {title.groups}
          {allGroupsUnseenMessages > 0 && (
            <Badge
              badgeContent={allGroupsUnseenMessages}
              color="primary"
              style={{ marginLeft: "20px", padding: "0px" }}
            />
          )}
        </Button>
      </Box>
    );
  }
);
export default SwitchTabs;
