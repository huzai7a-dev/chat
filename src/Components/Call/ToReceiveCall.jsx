import React from "react";
import './call.css'
import { Avatar, Box, IconButton, Typography } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { DANGER, SECONDARYDARK, SUCCESS } from "../../Theme/colorConstant";


const ToReceiveCall = ({handleReject,from}) => {
  const userName =
    from.toUpperCase().split(" ")[0][0] +
    from.toUpperCase().split(" ")[1][0];
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-around" className="onAnswerContainer">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar style={{ width: "80px", height: "80px" }}>
          <Typography variant="h5">{userName}</Typography>
        </Avatar>
        <Typography variant="h6" style={{color:"#fff"}}>{from}</Typography>
        <Typography variant="caption" style={{color:SECONDARYDARK}}>{from}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-around" style={{width:"50%"}}>
        <IconButton style={{ backgroundColor: SUCCESS }}>
          <CallIcon  style={{color:"#fff"}}/>
        </IconButton>
        <IconButton style={{ backgroundColor: DANGER }} onClick={handleReject}>
          <CallEndIcon style={{color:"#fff"}}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default ToReceiveCall;