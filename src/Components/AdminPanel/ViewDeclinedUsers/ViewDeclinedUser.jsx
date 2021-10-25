import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { approveUser, getDeclineUsers } from '../../../api/admin';
import User from '../User';

function ViewDeclinedUser() {
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
      getDeclineUsers({ data: { user_id: auth_user.elsemployees_empid } })
    ).then((res) => {
      setUsers(res.data.contacts);
    });
  }, [userUpdated]);

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
            {users.map((user) => {
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
    )
}

export default ViewDeclinedUser
