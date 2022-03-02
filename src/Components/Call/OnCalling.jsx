import React from 'react'
import {Box,Typography,Avatar,IconButton,Tooltip} from '@material-ui/core';
import CallEndIcon from "@material-ui/icons/CallEnd";
import { DANGER } from "../../Theme/colorConstant";
import './call.css';

const OnCalling = React.memo((props) => {

    return (
        <Box padding={0} className="onCallingContainer">
            <Box p={2}>
                <Typography variant="h5" style={{color:"#fff"}}>{props.name}</Typography>
            </Box>
            <Box className="userIconContainer">
                 <Avatar style={{height:"80px",width:"80px"}}>{props.name?.[0] || "A"}</Avatar>
            </Box>
            <Box className="endCalBtn">
                <Tooltip title="End Call">
                    <IconButton onClick={props.onReject}>
                        <CallEndIcon style={{color:DANGER}}/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
});

export default OnCalling;
