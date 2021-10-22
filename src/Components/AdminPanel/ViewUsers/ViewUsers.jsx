import { Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveUser, declineUser, getSignupUsers } from "../../../api/admin";
import User from "../User";

function ViewUsers() {
  const [users, setUsers] = React.useState([]);
  const [userUpdated, setUserUpdated] = React.useState({});
  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSignupUsers({ data: { user_id: auth_user.elsemployees_empid } })).then((res) => {
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
    dispatch(declineUser(params)).then((response)=>{
        setUserUpdated(response)
    })
  };

  const onApprove = (declineUserId) => {
    const params = {
      data: {
        user_id: auth_user.elsemployees_empid,
        signupuser_id: declineUserId,
        action: 2,
      },
    };
    dispatch(approveUser(params)).then((response)=>{
        setUserUpdated(response)
    })
  };
  return (
    <div style={{height:"100%", overflow:"auto",width:"100%"}}>
      {users.length > 0 ? (
        users.map((user) => (
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
        <Typography variant="h5">There is no User</Typography>
      )}
    </div>
  );
}

export default ViewUsers;
