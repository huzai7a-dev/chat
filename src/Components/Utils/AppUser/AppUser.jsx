import { Box, Typography, Avatar, Badge } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { BACKGROUND } from "../../../Theme/colorConstant";

function AppUser({
  userName,
  userImage,
  activeUser,
  lastMessage,
  date,
  handleClick,
  path,
  unseen=0
}) {
  const {isNightMode } = useSelector((store) => {
    return {
      sideBarCollapsed: store.app.sideBarCollapsed || false,
      isNightMode: store.app.mode || false,
    };
  });
  return (
    <Box
      onClick={handleClick}
      display="flex"
      style={{
        height: "65px",
        cursor: "pointer",
        backgroundColor: activeUser
          ? BACKGROUND[isNightMode?"dark":"light"].active
          : BACKGROUND[isNightMode?"dark":"light"].default,
        color: isNightMode ? "#fff" : "#000" 
      }}
      paddingX={1}
      paddingY={1.2}
    >
      <Box display="flex" alignItems="center" marginRight={0.8}>
        {!(userImage == "null" || userImage == null) ? (
          <Avatar src={path + userImage} />
        ) : (
          <Avatar />
        )}
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
            <Typography variant="caption">{lastMessage}</Typography>
            <Badge style={{position:"absolute",right:"0",bottom:"0",marginRight:"8px",marginBottom:"9.6px"}} badgeContent={unseen} color="primary"/>
        </Box>
      </Box>
    </Box>
  );
}

export default AppUser;
