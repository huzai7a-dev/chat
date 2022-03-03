
import { Typography, Paper, TextField, makeStyles, Avatar, IconButton, Box,Button } from '@material-ui/core';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import SendIcon from '@material-ui/icons/Send';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import DoneIcon from '@material-ui/icons/Done';
import { sendMessage } from '../../../../api/message';
import { BLACK, DARKMAIN, WHITE } from '../../../../Theme/colorConstant';
const useStyle = makeStyles({
    paper: {
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        padding: "5px",
    },
    option: {
        position: "sticky",
        top: "0",
        zIndex: "10",
        padding:"5px"
    },
    userContainer:{
        margin:"5px 0px",
    }
})
function ForwardMessageModel({setForwardModel,params}) {
    const classes = useStyle();
    const dispatch = useDispatch()
    const [toForward, setToForward] = useState("");
    const [sentTo, setSentTo] = useState("");
    const [sentUser,setSentUser] = useState([])
    const { contacts, auth_user, isNightMode } = useSelector((store) => {
        return {
            auth_user: store.auth.auth_user || { },
            contacts: store.message.contacts.contacts || [],
            activeUser: store?.chat || {},
            isNightMode:store.app.mode || false
        };
    });
    const searchedUsers =(members)=>{
        return members.elsemployees_name.toLowerCase().indexOf(toForward.toLocaleLowerCase()) >= 0;
    }
    
    const forwardMessage=async (userId)=>{
        setSentTo(userId)
        const messageParams = {
            data:{
                ...params.data,
                message_to:userId,
            }
        }
        const response = await dispatch(sendMessage(messageParams))
        setSentUser([...sentUser,response.data.data.message_to]);  
    }

    return (
        <Paper className={classes.paper} style={{background:isNightMode ? DARKMAIN : WHITE}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" className={classes.option} >
                <IconButton color="primary" onClick={()=>{setForwardModel(false)}}><ArrowBackIosIcon /></IconButton>
                <TextField
                    style={{color:isNightMode ? WHITE: BLACK}}
                    label="Search"
                    fullWidth
                    value={toForward}
                    onChange={(e)=>{setToForward(e.target.value)}}
                />
                <Button color="primary" onClick={()=>{setForwardModel(false)}}>Done</Button>
            </Box>
            <Paper elevation={0} style={{background:isNightMode ? DARKMAIN : WHITE}}>
                {contacts.filter(searchedUsers).map((contact) => {
                    const sentToUser = sentUser.includes(contact.elsemployees_empid)
                    return (
                    <Paper variant="outlined" className={classes.userContainer} key={contact.elsemployees_empid} style={{display: contact.elsemployees_empid == auth_user.elsemployees_empid ? "none" : null,background:isNightMode ? DARKMAIN : WHITE }}>
                        <Box display="flex" justifyContent="space-around" alignItems="center">
                           {contact.elsemployees_image ? <Avatar src={`/bizzportal/public/img/${contact.elsemployees_image}`}/>: <Avatar>{contact?.elsemployees_name?.[0]}</Avatar>}
                            <Typography style={{width:"200px",color:isNightMode ? WHITE: BLACK }}>{contact.elsemployees_name}</Typography>
                            <IconButton color="primary" onClick={()=>{forwardMessage(contact.elsemployees_empid)}}> {sentToUser ? <DoneIcon/>:<SendIcon />}</IconButton>
                        </Box>
                    </Paper>
                )})}
            </Paper>
        </Paper>

    )
}

export default React.memo(ForwardMessageModel);
