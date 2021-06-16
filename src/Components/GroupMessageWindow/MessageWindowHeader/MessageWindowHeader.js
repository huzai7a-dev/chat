import React from "react";
import "./messageWindowHeader.css";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from '@material-ui/core';
import Modal from "react-modal";
import EditGroup from "../EditGroup/EditGroup";
import { modelState, participantModel } from "../../../Redux/Action";
import Participants from "../Participants/Participants";

function MessageWindowHeader() {
  const data = useSelector((state) => {
    return state;
  });
  const dispatch = useDispatch();
  const memberLength = data.groupChat.memberid.split(",").length;
  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2>{data.groupChat.group_name}</h2>
        <p onClick={() => dispatch(participantModel(true))}>{memberLength} participants</p>
      </div>
      <div className="groupEdit">
        <IconButton onClick={() => dispatch(modelState(true))}>
          <GroupAddIcon color="primary" style={{ width: "40px", height: "40px" }} />
        </IconButton>
      </div>
      <Modal className="groupModel" isOpen={data.modelState} onRequestClose={() => dispatch(modelState(false))}>
        <EditGroup />
      </Modal>

      <Modal className="groupModel" isOpen={data.participantModel} onRequestClose={() => dispatch(participantModel(false))}>
        <Participants />
      </Modal>
    </div>
  );
}

export default MessageWindowHeader;
