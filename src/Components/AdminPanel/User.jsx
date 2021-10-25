import React from "react";
import { Box, Typography, Avatar, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import { DANGER, DANGERLIGHT, SUCCESS, SUCCESSLIGHT } from "../../Theme/colorConstant";

function User({name,profile,handleDecline,handleApproved}) {
  return (
    <Box display="flex" justifyContent="center" style={{width:"100%",margin:"5px 0px"}}>
      <Box display="flex" alignItems="center" style={{width:"50%"}}>
          <Box display="flex" alignItems="center" flex="3">
            <Avatar src={`/bizzportal/public/img/${profile}`} style={{marginRight:"5px"}}/>
            <Typography style={{flex:"2"}}>{name}</Typography>
          </Box>
        <Box display="flex" flex="2" justifyContent="space-around">
          {handleDecline && <Button variant="outlined" style={{color:DANGER, backgroundColor:DANGERLIGHT}} onClick={handleDecline}>Decline</Button>}
          {handleApproved &&<Button variant="outlined" style={{color:SUCCESS, background:SUCCESSLIGHT}} onClick={handleApproved}>Approve</Button>}
        </Box>
      </Box>
    </Box>
  );
}   

export default User;
