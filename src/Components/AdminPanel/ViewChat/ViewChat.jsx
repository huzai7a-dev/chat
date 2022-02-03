import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts } from "../../../api/chat";
import ToUser from "./ToUser";
import FromUser from "./FromUser";
import { getAdminUserMessages } from "../../../api/message";
import MessageContainer from "./MessageContainer";
import { filterList } from "../../../helper/util";
import { BLACK, WHITE } from "../../../Theme/colorConstant";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "400px",
    },
  },
  mainContainer: {
    height: "500px",
    display: "flex",
    overflowY: "auto",
  },
  userContainer: {
    height: "100%",
    overflowY: "auto",
    width: "410px",
    overflowX: "hidden",
  },
}));
function ViewMessages() {
  const classes = useStyles();
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [toId, setToId] = useState("");
  const [fromId, setFromId] = useState("");
  const [hasMessages, setHasMessages] = useState(false);
  const [isUserSelected, setUserSelected] = useState(true);

  const { auth_user, contacts, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode: store.app.mode || false,
      contacts: store.chat.allContacts || [],
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const params = {
      data: {
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getAllContacts(params));
  }, []);

  const handleToUser =(e)=>{
        setTo(e.target.value);        
        if(to.length > 0){
            setHasMessages(false)
        }else {
            setHasMessages(true)
        }
  }
  const handleFromUser = (e)=>{
    setFrom(e.target.value);
    if (from.length > 0) {
        setHasMessages(false);
    }else {
        setHasMessages(true)
    }
  }
  
  const selectToUser = (toUser) => {
    setUserSelected(false);
    setTo(toUser.elsemployees_name);
    setToId(toUser.elsemployees_empid);
  };

  const selectFromUser = (fromUser) => {
    setFrom(fromUser.elsemployees_name);
    setFromId(fromUser.elsemployees_empid);
  };

  const params = {
    data: {
      from_id: fromId,
      to_id: toId,
      user_id: auth_user?.elsemployees_empid,
    },
  };

  const getMessages = () => {
    dispatch(getAdminUserMessages(params)).then((res) => {
      setHasMessages(true);
    });
  };

  const FromUserList = () => {
    return (
      <div className={classes.userContainer}>
        {contacts.filter( v => filterList(v.elsemployees_name,from)).map((user) => {
          return user.elsemployees_name.toLowerCase() ===
            to.toLowerCase() ? null : (
            <FromUser
              user={user}
              key={user.elsemployees_empid}
              onSelectUser={selectFromUser}
            />
          );
        })}
      </div>
    );
  };
  const ToUserList = () => {
    return (
      <div className={classes.userContainer}>
        {contacts.filter(v =>filterList(v.elsemployees_name,to)).map((user) => {
          return (
            <ToUser
              user={user}
              key={user.elsemployees_empid}
              onSelectToUser={selectToUser}
            />
          );
        })}
      </div>
    );
  };
 

  return (
    <Box style={{ marginBottom: "20px" }}>
      <Box display="flex" alignItems="baseline">
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          <TextField
            label="To"
            InputLabelProps={{style: {color: isNightMode ? WHITE: BLACK}}}
            InputProps={{style: {color: isNightMode ? WHITE: BLACK}}}
            style={{color: isNightMode ? WHITE: BLACK}}
            onChange={handleToUser}
            value={to}
          />
          <TextField
            label="From"
            InputLabelProps={{style: {color: isNightMode ? WHITE: BLACK}}}
            InputProps={{style: {color: isNightMode ? WHITE: BLACK}}}
            style={{color: isNightMode ? WHITE: BLACK}}
            onChange={handleFromUser}
            value={from}
            disabled={isUserSelected}
          />
        </form>
        <Button color="primary" variant="outlined" onClick={getMessages}>
          Get Messages
        </Button>
      </Box>
      <Box className={classes.mainContainer}>
        {hasMessages ? (
          <MessageContainer toId={toId} messageParams={params} />
        ) : (
          <div className={classes.mainContainer}>
            {to.length > 0 && <ToUserList />}
            {from.length > 0 && <FromUserList />}
          </div>
        )}
      </Box>
    </Box>
  );
}

export default ViewMessages;
