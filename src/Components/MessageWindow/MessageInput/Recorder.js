import React from "react";
import { Box, IconButton, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import PauseIcon from "@material-ui/icons/Pause";
import Tooltip from "@material-ui/core/Tooltip";
import { SECONDARYMAIN, PRIMARYMAIN } from "../../../Theme/colorConstant";
import "./record.css";
const Recorder = ({ onCancelVoice, onStopVoice, status }) => {
  return (
    <Box display="flex" alignItems="center" className="recorderContainer">
      <Tooltip title="Cancel">
        <IconButton onClick={onCancelVoice}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Stop">
        <IconButton onClick={onStopVoice} disabled={status !== "recording"}>
          <PauseIcon />
        </IconButton>
      </Tooltip>
      <Box flex="1" style={{ paddingRight: "15px" }}>
        <Typography variant="caption">{status}</Typography>
      </Box>
    </Box>
  );
};

export default React.memo(Recorder);
