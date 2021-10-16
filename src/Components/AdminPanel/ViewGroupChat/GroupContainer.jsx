import React from "react";
import { Box, Avatar, makeStyles, Typography } from "@material-ui/core";
import Group from "./Group";


function GroupContainer({ groups }) {
  return (
    <Box>
      {groups.map((group) => {
        return <Group group={group} key={group.group_id}/>;
      })}
    </Box>
  );
}

export default GroupContainer;
