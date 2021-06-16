import { IconButton } from "@material-ui/core";
import React, { useState } from "react";
import Modal from "react-modal";
import "./addChat.css";
import GroupListContainer from "./GroupListContainer/GroupListContainer";
import GroupName from "./GroupName/GroupName";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
function AddChat() {
  const [groupModelName, setGroupModelName] = useState(false);
  const [groupModelListContaier, setgroupModelListContaier] = useState(false);
  const [passGroupName, setPassGroupName] = useState("");
  const [passGroupPicture, setPassGroupPicture] = useState("");

  return (
    <>
      <div className="add__chat">
        <IconButton
          className="addChat__btn"
          onClick={() => {
            setGroupModelName(true);
          }}
        > 
          <GroupAddIcon style={{marginRight:"10px"}}/>
          Create New Group
        </IconButton>
      </div>

      <Modal
        isOpen={groupModelName}
        onRequestClose={() => {
          setGroupModelName(false);
        }}
        className="groupModel"
      >
        <GroupName
          setGroupModelName={setGroupModelName}
          setgroupModelListContaier={setgroupModelListContaier}
          setPassGroupName={setPassGroupName}
          setPassGroupPicture={setPassGroupPicture}
          passGroupPicture={passGroupPicture}
        />
      </Modal>

      <Modal
        isOpen={groupModelListContaier}
        onRequestClose={() => {
          setgroupModelListContaier(false);
        }}
        className="groupModel"
      >
        <GroupListContainer
          setgroupModelListContaier={setgroupModelListContaier}
          setGroupModelName={setGroupModelName}
          passGroupName={passGroupName}
          passGroupPicture={passGroupPicture}
        />
      </Modal>
    </>
  );
}

export default AddChat;
