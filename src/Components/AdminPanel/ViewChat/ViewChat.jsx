import React, { useEffect, useRef, useState } from 'react'
import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { getContactsTotal } from '../../../api/chat';
import ToUser from './ToUser';
import { Skeleton } from '@mui/material';
import FromUser from './FromUser';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    },
    userContainer: {
        height: "500px",
        overflowY: "auto"
    }
}));
function ViewMessages() {
    const classes = useStyles();
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const toRef = useRef();
    const fromRef = useRef();

    const { auth_user, contacts } = useSelector((store) => {
        return {
            auth_user: store.auth.auth_user || {},
            isNightMode: store.app.mode || false,
            contacts: store.chat.contacts || [],
        }
    });
    const dispatch = useDispatch();
    useEffect(() => {
        const params = {
            data: {
                user_id: auth_user?.elsemployees_empid,
            }
        }
        dispatch(getContactsTotal(params))
    }, [])

    const filterToUser = (user) => {
        return user?.elsemployees_name?.toLowerCase()?.indexOf(to) >= 0;
    }
    const filterFromUser = (user) => {
        return user?.elsemployees_name?.toLowerCase()?.indexOf(from) >= 0;
    }
    const selectToUser = (userName) => {
        setTo(userName)
    }
    const selectFromUser = (userName) => {
        setFrom(userName)
    }
    const FromUserList = () => {
        return (
            <>
                {contacts.filter(filterFromUser).map((user) => {
                    return <FromUser user={user} key={user.elsemployees_empid} onSelectUser={selectFromUser} />
                })}
            </>
        )
    }
    const ToUserList = () => {
        return (
            <>
                {contacts.filter(filterToUser).map((user) => {
                    return <ToUser user={user} key={user.elsemployees_empid} onSelectToUser={selectToUser} />
                })}
            </>
        )
    }
    return (
        <Box style={{ margin: "0 auto" }}>
            <form className={classes.root} noValidate autoComplete="off" style={{ display: "flex", alignItems: "flex-end" }}>
                <TextField ref={toRef} label="To" onChange={(e) => { setTo(e.target.value) }} value={to} />
                <TextField ref={fromRef} label="From" onChange={(e) => { setFrom(e.target.value) }} value={from} />
                <Button color="primary" variant="outlined">Get Messages</Button>
            </form>
            <Box className={classes.userContainer}>
                <ToUserList />
                <FromUserList />
            </Box>
        </Box>
    )
}

export default ViewMessages
