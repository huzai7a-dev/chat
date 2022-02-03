import React from "react";
import { Box, Avatar, makeStyles, Typography,Button } from "@material-ui/core";
import { BLACK, PRIMARYMAIN, WHITE } from "../../../Theme/colorConstant";
import { useDispatch, useSelector } from "react-redux";
import { getAdminGroupMessages } from "../../../api/message";

function Group({ group,setHasMessages }) {
  const { auth_user, isNightMode} = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode: store.app.mode,
    };
  });
  const dispatch=useDispatch();
  const getMessages =()=>{
    const params = {
      data: {
        group_id: group?.group_id,
        user_id: auth_user?.elsemployees_empid,
      },
    };
    dispatch(getAdminGroupMessages(params)).then(() => {
      setHasMessages(true);
    })
  }
  return (
    <Button style={{display:"block",width:"100%",margin:"10px 0px"}} onClick={getMessages}>
      <Box display="flex" alignItems="center">
        <Box m={1}>
          {group.group_image == null ? (
            <Avatar style={{color:PRIMARYMAIN,background:"aliceblue"}}>{group.group_name[0]}</Avatar>
          ) : (
            <Avatar
              src={`/api/bwccrm/storage/app/public/chat_attachments/${group.group_image}`}
            />
          )}
        </Box>
        <Box style={{color: isNightMode ? WHITE: BLACK}}>{group.group_name}</Box>
      </Box>
    </Button>
  );
}

export default Group;
