import { Box, Typography, Avatar, Badge } from "@material-ui/core";
import React from "react";
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
  return (
    <Box
      onClick={handleClick}
      display="flex"
      style={{
        height: "65px",
        cursor: "pointer",
        backgroundColor: activeUser
          ? BACKGROUND["light"].active
          : BACKGROUND["light"].default,
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
