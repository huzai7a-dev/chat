import React from 'react'
import { Box,Typography,Avatar } from "@material-ui/core";
import { DARKLIGHT } from '../../Theme/colorConstant';
import './call.css';
function OnCall({callTo}) {
    const userName = callTo.toUpperCase().split(" ")[0][0] + callTo.toUpperCase().split(" ")[1][0];
    return (
        <div className="onCallContainer">
            <Box p={2}>
                <Typography variant="h4" style={{color:"#fff"}}>{callTo}</Typography>
            </Box>
            <Box className="userIconContainer">
                <Avatar style={{width:"200px",height:"200px"}}><Typography variant="h5">{userName}</Typography></Avatar>    
            </Box>

        </div>
    )
}

export default React.memo(OnCall);
