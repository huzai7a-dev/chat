import React,{ useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Box, Badge } from "@material-ui/core";
import { BLACK, PRIMARYMAIN, SECONDARYMAIN, WHITE } from "../../Theme/colorConstant";

const SwitchTabs = React.memo(
  ({ tabValue, setTabValue, }) => {
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
    }, [auth_user, changePeopleTab, dispatch]);

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
    }, [setTabValue]);

    const changeGroupTab = useCallback(async () => {
      setTabValue("Groups");
    }, [setTabValue]);

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
            background: tabValue == title.people ? PRIMARYMAIN : SECONDARYMAIN,
            color: tabValue == title.people ? WHITE : BLACK,
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
            background: tabValue == title.groups ? PRIMARYMAIN : SECONDARYMAIN,
            color: tabValue == title.groups ? WHITE : BLACK,
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
