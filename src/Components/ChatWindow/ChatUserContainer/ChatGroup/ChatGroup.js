import { Avatar, makeStyles, Badge, Box } from "@material-ui/core";
import { useDispatch, useSelector, useMemo } from "react-redux";
import "./chatUser.css";
import { useHistory } from "react-router-dom";
import { setActiveGroup, setHeaderData } from "../../../../Redux/actions/chat";
import { getUserGroups, seenGroupMessage } from "../../../../api/chat";
import {
  DARKLIGHT,
  DARKMAIN,
  PRIMARYMAIN,
  SECONDARYDARK,
  WHITE,
} from "../../../../Theme/colorConstant";
import moment from "moment";
import { getSocket } from "../../../../socket";
import React, { useCallback } from "react";
import { setSideBar } from "../../../../Redux/actions/app";
const useStyles = makeStyles({
  group: {
    background: SECONDARYDARK,
    color: PRIMARYMAIN,
    fontWeight: "600",
    fontSize: ".8rem",
  },
});
function ChatGroup({ group }) {
  const classes = useStyles();
  const history = useHistory();
  const image = group.group_image;
  const dispatch = useDispatch();
  const { auth_user, active_group, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      isNightMode: store.app.mode || false,
    };
  });
  const active = active_group.group_id == group.group_id;
  const switchToGroupChat = useCallback(() => {
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
    history.push(`/group/${group.group_name}`);
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
  }, [
    active_group.group_id,
    auth_user?.elsemployees_empid,
    dispatch,
    group,
    history,
  ]);

  const background = isNightMode && DARKMAIN;
  const activeBackground = isNightMode ? DARKLIGHT : WHITE;
  const heading = isNightMode ? WHITE : "#252423";

  const groupNamePicture =
    group.group_name.split(" ").length > 1
      ? group.group_name.toUpperCase().split(" ")[0][0] +
        group.group_name.toUpperCase().split(" ")[1][0]
      : group.group_name.toUpperCase()[0] + group.group_name.toUpperCase()[1];

    const renderLastMessageText = useMemo(() => {
      if(group.lastmessage !== "null" && group.lastmessage) {
        return group.lastmessage
      } else if(group?.attachment) {
        return "Attachment"
      } else if(parseInt(group.created_by) == parseInt(auth_user.elsemployees_empid)) {
        return "You created this group";
      } else {
        return "Be the first to initiate conversation";
      }
    }, [auth_user.elsemployees_empid, group])

  return (
    <div
      className="chatUser"
      style={{ background: active ? activeBackground : background }}
      onClick={switchToGroupChat}
    >
      <div className="chatUser__picture">
        {image ? (
          <Avatar
            src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`}
          />
        ) : (
          <Avatar className={classes.group}>{groupNamePicture}</Avatar>
        )}
      </div>
      <div className="chatUser__details">
        <Box display="flex" justifyContent="space-between">
          <h3
            style={{
              color: group.groupunseenmesg ? PRIMARYMAIN : heading,
              fontWeight: group.groupunseenmesg ? "600" : "100",
              flex: "3",
            }}
          >
            {group.group_name}
          </h3>
          <p style={{ flex: "1" }}>
            {moment(group?.groupmessagetime|| group?.updated_at).format("LT")}
          </p>
        </Box>

        <div className="chatUser__lastMessage">
          <p style={{ fontWeight: group.groupunseenmesg && "900" }}>
            {renderLastMessageText}
          </p>
        </div>
      </div>
      <div className="unseenMsg">
      {group.groupunseenmesg ? <Badge badgeContent={group.groupunseenmesg} color="primary"></Badge> : null}
      </div>
    </div>
  );
}

export default React.memo(ChatGroup);
