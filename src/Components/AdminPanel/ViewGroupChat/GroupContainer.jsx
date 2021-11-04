import React from "react";
import { Box, Avatar, makeStyles, Typography } from "@material-ui/core";
import Group from "./Group";
import { filterList } from "../../../helper/util";


function GroupContainer({ groups, searchGroup,setHasMessages }) {
  
  return (
    <Box>
      {groups.filter(v=> filterList(v.group_name,searchGroup)).map((group) => {
        return <Group group={group} key={group.group_id} setHasMessages={setHasMessages}/>;
      })}
    </Box>
  );
}

export default GroupContainer;
