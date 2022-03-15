import { Box, Typography, Avatar, Badge } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { BLACK, DARKACTIVE, LIGHTACTIVE, WHITE } from "../../../Theme/colorConstant";

function AppUser({
  userName,
  userImage,
  lastMessage,
  date,
  handleClick,
  path,
  unseen=0,
  activeUser,
  userId
}) {
  const {isNightMode, onlineUsers } = useSelector((store) => {
    return {
      sideBarCollapsed: store.app.sideBarCollapsed || false,
      isNightMode: store.app.mode || false,
      onlineUsers: store.chat.onlineUsers
    };
  });

  const getBackgroundColor = ()=> {
    if(activeUser && isNightMode){
      return DARKACTIVE
    }else if(activeUser && !isNightMode){
      return LIGHTACTIVE
    }
  }
  return (
    <Box
      onClick={handleClick}
      display="flex"
      style={{
        height: "65px",
        cursor: "pointer",
        background:getBackgroundColor(),
        color: isNightMode ? WHITE : BLACK,
      }}
      paddingX={1}
      paddingY={1.2}
      marginX={0.8}
    >
      <Box display="flex" alignItems="center" marginRight={0.8} position="relative">
        {!(userImage == "null" || userImage == null) ? (
          <Avatar src={path + userImage} />
        ) : (
          <Avatar />
        )}
        {onlineUsers?.includes(`${userId}`) ? (
          <div className="onlineStatus" />
        ) : null}
      </Box>
      <Box flex="1" style={{position:'relative',}}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" style={{ fontSize: "1rem" }}>
            {userName}
          </Typography>
          <Typography variant="caption">{date}</Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          style={{
            whiteSpace: "nowrap",
            width: "200px",
            overflowX: "hidden",
          }}
        >
            <Typography variant="caption" style={lastMessageStyles} >{lastMessage}</Typography>
            {unseen ? <Badge style={{position:"absolute",right:"0",bottom:"0",marginRight:"8px",marginBottom:"9.6px"}} badgeContent={unseen} color="primary"/>: null}
        </Box>
      </Box>
    </Box>
  );
}

export default AppUser;

const lastMessageStyles = {
  overflow: "hidden",
    display: "inlineBlock",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
}