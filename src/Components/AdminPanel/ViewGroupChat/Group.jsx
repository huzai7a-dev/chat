import React from "react";
import { Box, Avatar, makeStyles, Typography,Button } from "@material-ui/core";
import { PRIMARYMAIN } from "../../../Theme/colorConstant";

function Group({ group }) {
  return (
    <Button style={{display:"block",width:"100%",margin:"10px 0px"}}>
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
        <Box>{group.group_name}</Box>
      </Box>
    </Button>
  );
}

export default Group;
