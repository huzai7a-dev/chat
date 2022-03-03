import React, { useEffect, useState, useCallback } from "react";
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
import { DANGER, WHITE } from "../../Theme/colorConstant";
import Ringing from "../AnimationComponents/Ringing";
import { useDispatch, useSelector } from "react-redux";
import { getActiveUsers } from "../../api/chat";

const OnCall = React.memo((props) => {
  const { callUser, onRejectOutgoingCall } = props;
  const dispatch = useDispatch();
  const [callStatus, setCallStatus] = useState("Searching");

  const { callingTo } = useSelector((store) => {
    return {
      callingTo: store.call.callingTo,
    };
  });

  const initiateCall = useCallback(async () => {
    if (callingTo?.elsemployees_empid) {
      try {
        const response = await dispatch(getActiveUsers());
        if(response.data?.some(id => parseInt(id) == parseInt(callingTo.elsemployees_empid))) {
          setCallStatus("Ringing")
          callUser(callingTo);
        } else {
          alert(`${callingTo.elsemployees_name} is unavailable at the moment`);
          if(onRejectOutgoingCall) onRejectOutgoingCall()
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [callingTo, callUser, dispatch,onRejectOutgoingCall])

  useEffect(() => {
    initiateCall();
  }, [initiateCall]);

  return (
    <div className="onCallContainer">
      <audio loop autoPlay>
        <source src="/audio/waiting.wav" type="audio/wav" />
      </audio>
      <Box p={2}>
        <Typography variant="h5" style={{ color: WHITE }}>
          {callingTo?.elsemployees_name}
        </Typography>
        <Typography variant="caption" style={{ color: WHITE }}>
        {`${callStatus}...`}
        </Typography>
      </Box>
      <Box className="userIconContainer">
        <Ringing lotti={calling} height={200} width={200} />
      </Box>
      <Box className="userIconContainer">
        <Avatar src={`/bizzportal/public/img/${callingTo?.elsemployees_image}`} style={{ width: "120px", height: "120px" }} />
      </Box>
      <div className="endCalBtn">
        <Tooltip title="End call">
          <IconButton onClick={props.onRejectOutgoingCall}>
            <CallEndIcon style={{ color: DANGER }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
});

export default React.memo(OnCall);
