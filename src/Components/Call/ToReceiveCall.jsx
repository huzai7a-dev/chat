import React from "react";
import './call.css'
import { Avatar, Box, IconButton, Typography } from "@material-ui/core";
import CallIcon from "@material-ui/icons/Call";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { DANGER, SECONDARYDARK, SUCCESS, WHITE } from "../../Theme/colorConstant";


const ToReceiveCall = React.memo((props) => {

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-around" className="onAnswerContainer">
      <audio loop autoPlay>
        <source src="/audio/incoming.wav" type="audio/wav" />
      </audio>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar src={`/bizzportal/public/img/${props.fromUser?.elsemployees_image}`} style={{ width: "80px", height: "80px" }}>
          <Typography variant="h5">{props.fromUser?.elsemployees_name}</Typography>
        </Avatar>
        <Typography variant="h6" style={{color:WHITE}}>{props.from}</Typography>
        <Typography variant="caption" style={{color:SECONDARYDARK}}>Incoming call...</Typography>
      </Box>
      <Box display="flex" justifyContent="space-around" style={{width:"50%"}}>
        <IconButton style={{ backgroundColor: SUCCESS }} onClick={props.onAcceptIncomingCall}>
          <CallIcon  style={{color:WHITE}}/>
        </IconButton>
        <IconButton style={{ backgroundColor: DANGER }} onClick={props.onRejectIncomingCall}>
          <CallEndIcon style={{color:WHITE}}/>
        </IconButton>
      </Box>
    </Box>
  );
});

export default ToReceiveCall;