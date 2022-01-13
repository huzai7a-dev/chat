import React from "react";
import { Box, Typography, Avatar } from "@material-ui/core";
import { profile_url } from "../../constants/apiConstants";
import "./user.css";
import { PRIMARYMAIN, SECONDARYDARK } from "../../Theme/colorConstant";

function User({ userName, userImage, onClick }) {
  const name = (userName || "")
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((n) => n[0])
    ?.join("");
  return (
    <Box
      className="user__container"
      display="flex"
      alignItems="center"
      onClick={onClick}
    >
      {userImage ? (
        <Avatar
          src={profile_url + userImage}
          style={{ width: "30px", height: "30px", marginRight: ".2rem" }}
        />
      ) : (
        <Avatar
          style={{
            background: SECONDARYDARK,
            color: PRIMARYMAIN,
            fontSize: ".8rem",
            marginRight: ".2rem"
          }}
        >
          {name}
        </Avatar>
      )}
      <Typography variant="caption">{userName}</Typography>
    </Box>
  );
}

export default React.memo(User);
