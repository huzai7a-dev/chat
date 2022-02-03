import React, { useEffect } from "react";
import { Box, makeStyles, Button, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../../api/chat";
import GroupContainer from "./GroupContainer";
import MessageContainer from "./MessageContainer";
import { BLACK, WHITE } from "../../../Theme/colorConstant";

const useStyles = makeStyles({
  groupsContainer: {
    height: "500px",
    overflowY: "auto",
    width: "100%",
    overflowX: "hidden",
    position: "relative",
  },
});
function ViewGroupChat() {
  const classes = useStyles();
  const [searchGroup, setSearchGroup] = React.useState("");
  const [hasMessages, setHasMessages] = React.useState(false);
  const { groups, isNightMode } = useSelector((store) => {
    return {
      groups: store?.chat.allGroups || [],
      isNightMode: store.app.mode || false,
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
  const handleSearch = (e)=>{
    setSearchGroup(e.target.value);
    if (searchGroup.length) {
      setHasMessages(false);
    }
  }
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <Box
        display="flex"
        alignItems="flex-end"
        style={{ marginBottom: "10px",color: isNightMode ? WHITE: BLACK }}
      >
        <TextField
          label="Search Group..."
          InputLabelProps={{style: {color: isNightMode ? WHITE: BLACK}}}
          style={{ width: "100%", color: isNightMode ? WHITE: BLACK }}
          value={searchGroup}
          InputProps={{style:{color: isNightMode ? WHITE: BLACK}}}
          onChange={handleSearch}
        />
        <Button
          variant="outlined"
          style={{ width: "170px", marginLeft: "20px" }}
          color="primary"
        >
          Get Messages
        </Button>
      </Box>
      <Box className={classes.groupsContainer}>
        {!hasMessages ? (
          <GroupContainer groups={groups} searchGroup={searchGroup} setHasMessages={setHasMessages} />
        ) : (
          <MessageContainer />
        )}
      </Box>
    </Box>
  );
}

export default ViewGroupChat;
