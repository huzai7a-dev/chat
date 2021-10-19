import React from "react";
import { Box, Avatar, makeStyles, Typography } from "@material-ui/core";
import Group from "./Group";


function GroupContainer({ groups, searchGroup,setHasMessages }) {
  const filterGroup = (group) => {
    return group?.group_name?.toLowerCase()?.indexOf(searchGroup) >= 0;
  };
  return (
    <Box>
      {groups.filter(filterGroup).map((group) => {
        return <Group group={group} key={group.group_id} setHasMessages={setHasMessages}/>;
      })}
    </Box>
  );
}

export default GroupContainer;
