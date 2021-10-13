import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import { getContactsTotal } from "../../../api/chat";
import ToUser from "./ToUser";
import { Skeleton } from "@mui/material";
import FromUser from "./FromUser";
import { getUserMessages } from "../../../api/message";
import MessageContainer from "./MessageContainer";

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

  const { auth_user, contacts } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode: store.app.mode || false,
      contacts: store.chat.contacts || [],
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const params = {
      data: {
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getContactsTotal(params));
  }, []);

  const filterToUser = (user) => {
    return user?.elsemployees_name?.toLowerCase()?.indexOf(to) >= 0;
  };
  const filterFromUser = (user) => {
    return user?.elsemployees_name?.toLowerCase()?.indexOf(from) >= 0;
  };
  const selectToUser = (toUser) => {
    setUserSelected(false);
    setTo(toUser.elsemployees_name);
    setToId(toUser.elsemployees_empid);
  };
  const selectFromUser = (fromUser) => {
    setFrom(fromUser.elsemployees_name);
    setFromId(fromUser.elsemployees_empid);
  };
  const FromUserList = () => {
    return (
      <div className={classes.userContainer}>
        {contacts.filter(filterFromUser).map((user) => {
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
        {contacts.filter(filterToUser).map((user) => {
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
  const getMessages = () => {
    const params = {
      data: {
        from_id: fromId,
        to_id: toId,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getUserMessages(params)).then((res) => {
      setHasMessages(true);
    });
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
            onChange={(e) => {
              setTo(e.target.value);
            }}
            value={to}
          />
          <TextField
            label="From"
            onChange={(e) => {
              setFrom(e.target.value);
            }}
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
          <MessageContainer toId={toId} />
        ) : (
          <div className={classes.mainContainer}>
            <ToUserList />
            <FromUserList />
          </div>
        )}
      </Box>
    </Box>
  );
}

export default ViewMessages;
