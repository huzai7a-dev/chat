import React from "react";
import { Box, Typography, Avatar, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import {
  BLACK,
  DANGER,
  DANGERLIGHT,
  SUCCESS,
  SUCCESSLIGHT,
  WHITE,
} from "../../Theme/colorConstant";
import { useSelector } from "react-redux";

function User({ name, profile, handleDecline, handleApproved }) {
  const { isNightMode } = useSelector(store => {
    return {
      isNightMode: store.app.mode,
    }
  });
  return (
    <Box
      display="flex"
      justifyContent="center"
      style={{ width: "100%", margin: "5px 0px" }}
    >
      <Box display="flex" alignItems="center" style={{ width: "50%" }}>
        <Box display="flex" alignItems="center" flex="3">
          <Avatar
            src={`/bizzportal/public/img/${profile}`}
            style={{ marginRight: "5px" }}
          />
          <Typography style={{ flex: "2",color: isNightMode ? WHITE: BLACK}}>{name}</Typography>
        </Box>
        <Box display="flex" flex="2" justifyContent="right">
          {handleDecline && (
            <Button
              variant="outlined"
              style={{
                color: DANGER,
                margin: "0px 10px",
                backgroundColor: DANGERLIGHT,
              }}
              onClick={handleDecline}
            >
              Decline
            </Button>
          )}
          {handleApproved && (
            <Button
              variant="outlined"
              style={{
                color: SUCCESS,
                margin: "0px 10px",
                background: SUCCESSLIGHT,
              }}
              onClick={handleApproved}
            >
              Approve
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default User;
