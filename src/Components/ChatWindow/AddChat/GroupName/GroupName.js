import React, { useState } from "react";
import "./groupName.css";

import { Avatar, Button, IconButton, Input } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
function GroupName({
  setGroupModelName,
  setgroupModelListContaier,
  setPassGroupName,
  setPassGroupPicture,
}) {
  const [groupPicture, setGroupPicture] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleImageChange = (e) => {
    setPassGroupPicture(e.target.files[0]);
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setGroupPicture(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="groupName" onKeyDown={(e)=>{
      e.key==="Enter" ? setgroupModelListContaier(true) : console.log("");
    }}>
      <div className="groupNameModel__prevIconContainer">
        <Button
          onClick={() => {
            setGroupModelName(false);
          }}
        >
          <ArrowBackIcon />
        </Button>
      </div>
      <div className="groupName__header">
        <h1>New Group Chat</h1>
      </div>

      <label className="groupNameModel__imageContainer">
        <input type="file" onChange={handleImageChange} />
        <Avatar src={groupPicture} className="groupProfile" />
      </label>

      <div className="groupNameModel__nameContainer">
        <Input
          placeholder="Group Name"
          className="groupNameInputField"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            setPassGroupName(e.target.value);
          }}
        />
      </div>

      <div className="groupNameModel__nextIconContainer">
        <IconButton
          disabled={!groupName}
          className={groupName ? "nextBtn" : ""}
          onClick={() => {
            setgroupModelListContaier(true);
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default GroupName;
