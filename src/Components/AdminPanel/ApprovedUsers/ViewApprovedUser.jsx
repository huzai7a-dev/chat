import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { declineUser, getApproveUsers } from "../../../api/admin";
import User from "../User";

export default function ViewApprovedUsers() {
  const [users, setUsers] = React.useState([]);
  const [userUpdated, setUserUpdated] = React.useState({});

  const { auth_user } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getApproveUsers({ data: { user_id: auth_user.elsemployees_empid } })
    ).then((res) => {
      setUsers(res.data.contacts);
    });
  }, [userUpdated]);
 
  const onDecline = (declineUserId) => {
    console.log('declined')
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
  return (
    <div style={{height:"100%", overflow:"auto",width:"100%"}}>
      {users.map((user) => {
        return (
          <User
            handleDecline={() => onDecline(user.elsemployees_empid)}
            key={user.elsemployees_empid}
            name={user.elsemployees_name}
            profile={user.elsemployees_image}
          />
        );
      })}
    </div>
  );
}
