import { Box, Typography, Avatar } from "@material-ui/core";
import React from "react";
import { BACKGROUND } from "../../../Theme/colorConstant";
import { useParams } from "react-router-dom";
function AppUser({
  userName,
  userImage,
  activeUser,
  lastMessage,
  date,
  handleClick,
}) {
  return (
    <Box
      onClick={handleClick}
      display="flex"
      style={{
        height: "55px",
        cursor: "pointer",
        backgroundColor: activeUser
          ? BACKGROUND["light"].active
          : BACKGROUND["light"].default,
      }}
      paddingX={1}
      paddingY={1.2}
    >
      <Box display="flex" alignItems="center" marginRight={0.8}>
        <Avatar src={userImage} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flex="1"
        justifyContent="center"
      >
        <Typography variant="h6" style={{ fontSize: "1rem" }}>
          {userName}
        </Typography>
        <Typography variant="caption">{lastMessage}</Typography>
      </Box>
      <Box>
        <Typography variant="caption">{date}</Typography>
      </Box>
    </Box>
  );
}

export default AppUser;
