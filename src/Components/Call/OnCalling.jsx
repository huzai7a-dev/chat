import React from 'react'
import {Box,Typography,Avatar,IconButton,Tooltip} from '@material-ui/core';
import CallEndIcon from "@material-ui/icons/CallEnd";
import { DANGER } from "../../Theme/colorConstant";
import './call.css'
const OnCalling = ({name,handleCallEnd})=>{
    return (
        <Box className="onCallingContainer">
            <Box p={2}>
                <Typography variant="h5" style={{color:"#fff"}}>{name}</Typography>
            </Box>
            <Box className="userIconContainer">
                 <Avatar style={{height:"80px",width:"80px"}}>{name[0]}</Avatar>
            </Box>
            <Box className="endCalBtn">
                <Tooltip title="End Call">
                    <IconButton onClick={handleCallEnd}>
                        <CallEndIcon style={{color:DANGER}}/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default React.memo(OnCalling)