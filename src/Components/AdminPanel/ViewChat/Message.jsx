import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { PRIMARYMAIN } from '../../../Theme/colorConstant';

const useStyles = makeStyles((theme) => ({
    message:{
        width:"450px",
        background:PRIMARYMAIN,
        height:"auto",
        minHeight:"40px",
        overflowY:"auto",
        margin:"10px 0px",
        padding:"10px",
        alignSelf: props => props.message.message_to == props.toId ? "end" : "start"
    }
}));

function Message(props) {
    const classes = useStyles(props);
    return (
        <Box className={classes.message}>
            <Typography>{props.message.message_body}</Typography>
        </Box>
    )
}

export default Message
