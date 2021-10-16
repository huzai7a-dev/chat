import React, { useEffect } from "react";
import { Box, makeStyles, Typography, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../../api/chat";
import GroupContainer from "./GroupContainer";

const useStyles = makeStyles({
  groupsContainer: {
    height: "600px",
    overflowY: "auto",
    width: "100%",
    overflowX: "hidden",
    padding: "0px 20px",
    position: "relative",
  },
});
function ViewGroupChat() {
  const classes = useStyles();
  const [group,setGroup]= React.useState();
  const { groups } = useSelector((store) => {
    return {
      groups: store?.chat.allGroups || [],
    };
  });
  const dispatch = useDispatch();
  const params = {
    data: {
      user_id: 1,
    },
  };
  useEffect(() => {
    dispatch(getAllGroups(params));
  }, []);
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <TextField label="Search Group..." style={{width:"100%"}} value={group} onChange={(e)=>{setGroup(e.target.value)}}/>
      <Box className={classes.groupsContainer}>
        <GroupContainer groups={groups} />
      </Box>
    </Box>
  );
}

export default ViewGroupChat;
