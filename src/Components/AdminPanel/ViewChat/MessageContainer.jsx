import { Box, makeStyles } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux';
import Message from './Message'

const useStyles = makeStyles(() => ({
    messageContainer:{
        height:"100%",
        overflowY:"auto",
        width:"100%",
        overflowX:"hidden",
        display: "flex",
        flexDirection: "column-reverse",
        padding:"0px 20px"
    }
}));

function MessageContainer(props) {
    const classes = useStyles();
    const { messages } = useSelector((store) => {
        return {
          messages: store.message.userMessages || []
        }
      });
    return (
        <Box className={classes.messageContainer}>
            {messages.map((message)=>{
               return <Message key={message.message_id} message={message} toId={props.toId}/>
            })}
        </Box>
    )
}

export default MessageContainer
