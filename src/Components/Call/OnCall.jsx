import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import calling from "../../Assets/animation/ringing.json";
import CallEndIcon from "@material-ui/icons/CallEnd";
import "./call.css";
import { DANGER } from "../../Theme/colorConstant";
import Ringing from "../AnimationComponents/Ringing";
function OnCall({ callTo, endCall }) {
  const userName =
    callTo.toUpperCase().split(" ")[0][0] +
    callTo.toUpperCase().split(" ")[1][0];
  return (
    <div className="onCallContainer">
      <Box p={2}>
        <Typography variant="h5" style={{ color: "#fff" }}>
          {callTo}
        </Typography>
        <Typography variant="caption" style={{ color: "#fff" }}>
          Status
        </Typography>
      </Box>
      <Box className="userIconContainer">
        <Ringing lotti={calling} height={200} width={200} />
      </Box>
      <Box className="userIconContainer">
        <Avatar style={{ width: "120px", height: "120px" }}>
          <Typography variant="h5">{userName}</Typography>
        </Avatar>
      </Box>
      <div className="endCalBtn">
        <Tooltip title="End call">
          <IconButton onClick={endCall}>
            <CallEndIcon style={{ color: DANGER }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default React.memo(OnCall);
