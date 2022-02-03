import { Box, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveUser, getDeclineUsers } from "../../../api/admin";
import { filterList } from "../../../helper/util";
import { BLACK, WHITE } from "../../../Theme/colorConstant";
import User from "../User";

function ViewDeclinedUser() {
  const [users, setUsers] = React.useState([]);
  const [userUpdated, setUserUpdated] = React.useState({});
  const [userName, setUserName] = useState("");
  const { auth_user, isNightMode } = useSelector((store) => {
    return {
      isNightMode: store.app.mode,
      auth_user: store.auth?.auth_user || {},
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getDeclineUsers({ data: { user_id: auth_user.elsemployees_empid } })
    ).then((res) => {
      setUsers(res.data.contacts);
    });
  }, [auth_user.elsemployees_empid, dispatch, userUpdated]);

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
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        style={{ width: "100%", margin: "5px 0px" }}
      >
        <TextField
          InputLabelProps={{ style: { color: isNightMode ? WHITE : BLACK } }}
          InputProps={{ style: { color: isNightMode ? WHITE : BLACK } }}
          style={{ width: "50%" }}
          placeholder="Search User"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </Box>
      {users
        .filter((v) => filterList(v.elsemployees_name, userName))
        .map((user) => {
          return (
            <User
              handleApproved={() => {
                onApprove(user.elsemployees_empid);
              }}
              key={user.elsemployees_empid}
              name={user.elsemployees_name}
              profile={user.elsemployees_image}
            />
          );
        })}
    </div>
  );
}

export default ViewDeclinedUser;
