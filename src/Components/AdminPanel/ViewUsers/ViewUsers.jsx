import { Typography, Box, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveUser, declineUser, getSignupUsers } from "../../../api/admin";
import { filterList } from "../../../helper/util";
import User from "../User";

function ViewUsers() {
  const [users, setUsers] = React.useState([]);
  const [userUpdated, setUserUpdated] = React.useState({});
  const [userName,setUserName] = useState('');
  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getSignupUsers({ data: { user_id: auth_user.elsemployees_empid } })
    ).then((res) => {
      setUsers(res.data.contacts);
    });
  }, [userUpdated]);

  const onDecline = (declineUserId) => {
    const params = {
      data: {
        user_id: auth_user.elsemployees_empid,
        signupuser_id: declineUserId,
        action: 1,
      },
    };
    dispatch(declineUser(params)).then((response) => {
      setUserUpdated(response);
    });
  };

  const onApprove = (declineUserId) => {
    const params = {
      data: {
        user_id: auth_user.elsemployees_empid,
        signupuser_id: declineUserId,
        action: 2,
      },
    };
    dispatch(approveUser(params)).then((response) => {
      setUserUpdated(response);
    });
  };
  return (
    <div style={{ height: "100%", overflow: "auto", width: "100%" }}>
      <Box p={2} display="flex" justifyContent="center" style={{width:"100%",margin:"5px 0px"}}>
        <TextField  style={{width:"50%"}} placeholder="Search User" value={userName} onChange={(e)=> setUserName(e.target.value)}/>
      </Box>
      {users.length > 0 ? (
        users.filter(v => filterList(v.elsemployees_name,userName)).map((user) => (
          <User
            key={user.elsemployees_empid}
            name={user.elsemployees_name}
            profile={user.elsemployees_image}
            handleDecline={() => onDecline(user.elsemployees_empid)}
            handleApproved={() => {
              onApprove(user.elsemployees_empid);
            }}
          />
        ))
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%", width: "100%" }}
        >
          <Typography variant="h5">There is no User</Typography>
        </Box>
      )}
    </div>
  );
}

export default ViewUsers;
