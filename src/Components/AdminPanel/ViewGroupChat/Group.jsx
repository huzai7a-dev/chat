import React, { useCallback } from "react";
import { Box, Avatar, IconButton,Button } from "@material-ui/core";
import { BLACK, PRIMARYMAIN, WHITE } from "../../../Theme/colorConstant";
import { useDispatch, useSelector } from "react-redux";
import { getAdminGroupMessages } from "../../../api/message";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteGroup } from "../../../api/admin";
import { getAllGroups } from "../../../api/chat";

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
  };

  const onDeleteGroup = useCallback(async () => {
    try {
      const params = {
        data: {
          group_id: group.group_id,
        }
      }
      await dispatch(deleteGroup(params))
      await dispatch(getAllGroups(params));
    }
    catch (e) {
      console.log(e);
    }
  }, [group, dispatch]);

  return (
    <Button style={{ display:"flex", alignItems:"center",justifyContent:'space-between', flexDirection: 'row', width:"100%",margin:"10px 0px"}} onClick={getMessages}>
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
      <Box>
        <IconButton onClick={onDeleteGroup}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Button>
  );
}

export default Group;
