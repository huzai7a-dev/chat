import React, { useCallback, useState } from "react";
import "./groupName.css";

import { Avatar, Button, IconButton, Input, Typography } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { DARKMAIN } from "../../../../Theme/colorConstant";
import { useSelector } from "react-redux";
function GroupName({
  setGroupModelName,
  setgroupModelListContaier,
  setPassGroupName,
  setPassGroupPicture,
}) {
  const {isNightMode} = useSelector((store) => {
    return {
      isNightMode:store.app.mode || false
    };
  }); 

  const [groupPicture, setGroupPicture] = useState("");
  const [groupName, setGroupName] = useState("");

  const handleImageChange = useCallback((e) => {
    setPassGroupPicture(e.target.files[0]);
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setGroupPicture(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  },[setPassGroupPicture]);

  return (
    <div className="groupName" style={{background: isNightMode ? DARKMAIN : "#eee"}} onKeyDown={(e)=>{
      e.key==="Enter" && setgroupModelListContaier(true);
    }}>
      <div className="groupNameModel__prevIconContainer">
        <Button
          onClick={() => {
            setGroupModelName(false);
          }}
        >
          <ArrowBackIcon style={{color: isNightMode && "#fff"}} />
        </Button>
      </div>
      <div className="groupName__header">
        <Typography variant="h6" color={isNightMode ? "primary" : "textSecondary"}>New Group Chat</Typography>
      </div>

      <label className="groupNameModel__imageContainer">
        <input type="file" onChange={handleImageChange} />
        <Avatar src={groupPicture} className="groupProfile" />
      </label>

      <div className="groupNameModel__nameContainer">
        <Input
          style={{color:isNightMode ? "#fff": "#000"}}
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

export default React.memo(GroupName);
