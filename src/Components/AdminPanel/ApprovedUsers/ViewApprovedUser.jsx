import React, { useEffect } from "react";
import { TextField,Box } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";

import { declineUser, getApproveUsers } from "../../../api/admin";
import User from "../User";
import { filterList } from "../../../helper/util";
import { BLACK, WHITE } from "../../../Theme/colorConstant";

export default function ViewApprovedUsers() {
  const [users, setUsers] = React.useState([]);
  const [userUpdated, setUserUpdated] = React.useState({});
  const [userName,setUserName] = React.useState('');
  const { auth_user, isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth?.auth_user || {},
      isNightMode: store.app.mode,
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
    <div style={{height:"100%",width:"100%"}}>
      <Box p={2} display="flex" justifyContent="center" style={{width:"100%",margin:"5px 0px", color: isNightMode ? WHITE: BLACK}}>
        <TextField InputLabelProps={{style: {color: isNightMode ? WHITE: BLACK}}} InputProps={{style: {color: isNightMode ? WHITE: BLACK}}} style={{width:"50%", color: isNightMode ? WHITE: BLACK}} placeholder="Search User" value={userName} onChange={(e)=> setUserName(e.target.value)}/>
      </Box>
      <Box style={{height:"100%",width:"100%"}}>
      {users.filter(v => filterList(v.elsemployees_name,userName)).map((user) => {
        return (
          <User
            handleDecline={() => onDecline(user.elsemployees_empid)}
            key={user.elsemployees_empid}
            name={user.elsemployees_name}
            profile={user.elsemployees_image}
          />
        );
      })}
      </Box>
    </div>
  );
}
