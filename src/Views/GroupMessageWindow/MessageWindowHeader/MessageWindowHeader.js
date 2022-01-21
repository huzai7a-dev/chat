import React from "react";
import "./messageWindowHeader.css";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Typography,Box } from '@material-ui/core';
import Modal from "react-modal";
import EditGroup from "../EditGroup/EditGroup";

import Participants from "../Participants/Participants";
import { setEditGroupModelState,setParticipantModelState } from "../../../Redux/actions/app";
import { useHistory, useLocation } from "react-router-dom";

function MessageWindowHeader() {
  const history = useHistory();
  const location = useLocation();

  const {active_group, editGroupModelState,participantModelState,isNightMode} = useSelector((store) => {
    return {
      active_group: store.chat.active_group || {},
      editGroupModelState: store.app.editGroupModelState || false,
      participantModelState: store.app.participantModelState || false,
      isNightMode:store.app.mode || false
    };
  }); 

  const dispatch = useDispatch();
  const memberLength = active_group?.memberid?.split(",").length;

  const openGallery = ()=>{
    history.replace(`${location.pathname}#gallery`)
  }
  
  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2 style={{color:isNightMode ? "#fff":"#000"}}>{active_group?.group_name}</h2>
        <Box display="flex" alignItems="center">
        <p onClick={() => dispatch(setParticipantModelState(true))}>{memberLength} participants</p>
        <Typography variant="body2" style={{margin:"0px 5px"}}>|</Typography>
        <Typography variant="body2" onClick={openGallery}>Gallery</Typography>
        </Box>
      </div>
      <div className="groupEdit">
        <IconButton onClick={() => dispatch(setEditGroupModelState(true))}>
          <GroupAddIcon color="primary" style={{ width: "40px", height: "40px" }} />
        </IconButton>
      </div>
      <Modal className="groupModel" isOpen={editGroupModelState} onRequestClose={() => dispatch(setEditGroupModelState(false))}>
        <EditGroup />
      </Modal>

      <Modal className="groupModel" isOpen={participantModelState} onRequestClose={() => dispatch(setParticipantModelState(false))}>
        <Participants />
      </Modal>
    </div>
  );
}

export default MessageWindowHeader;
