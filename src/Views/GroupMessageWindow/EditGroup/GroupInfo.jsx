import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import { Avatar, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import { setEditGroupModelState, setEditGroupNameToMemberModelState } from "../../../Redux/actions/app";
import axios from "axios";
function GroupInfo() {
  const { auth_user, active_group,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      isNightMode:store.app.mode || false
    };
  });
  const defaultImage = `/api/bwccrm/storage/app/public/chat_attachments/${active_group?.group_image}`;
  const dispatch = useDispatch();
  const [name, setName] = useState(active_group?.group_name);
  const [editable, setEditable] = useState(false);
  const [groupPicture, setGroupPicture] = useState(defaultImage);
  const [selectedImage, setSelectedImage] = useState();
  const inputEl = useRef();
  const setGroupName = () => {
    inputEl.current.focus();
    setEditable(true);
  };
  const edited = () => {
    setEditable(false);
    inputEl.current.blur();
  };
  const nameChanged = active_group?.group_name !== name;
  const imgChanged = defaultImage !== groupPicture;
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setGroupPicture(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setSelectedImage(e.target.files[0]);
    }
  };
  console.log(selectedImage);
  const changeGroupNamePicture = () => {
    dispatch(setEditGroupNameToMemberModelState(true));
    if (nameChanged || imgChanged) {
      const formData = new FormData();
      formData.append("user_id", auth_user?.elsemployees_empid);
      formData.append("loginuser_id", auth_user?.elsemployees_empid);
      formData.append("group_id", active_group?.group_id);
      formData.append("group_name", name);
      formData.append("group_image", selectedImage);
      axios
        .post("/api/bwccrm/updateGroup", formData)
        .then((res) => {
          setName(res.data.groupupdated.group_name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="groupInfo">
      <div className="groupInfoHeader">
        <IconButton onClick={() => dispatch(setEditGroupModelState(false))}>
          <CloseIcon style={{color:isNightMode ? "#fff": "#000"}} />
        </IconButton>

        <IconButton onClick={changeGroupNamePicture}>
          <NavigateNextIcon style={{color:isNightMode ? "#fff": "#000"}} />
        </IconButton>
      </div>
      <div className="groupInfoPicture">
        <label>
          <input type="file" onChange={handleImageChange} />
          <Avatar
            src={groupPicture}
            style={{ width: "80px", height: "80px" }}
          />
        </label>
      </div>
      <div className="groupInfoName">
        <input
          style={{ borderBottom: editable ? "1px solid #d5d9de" : null }}
          disabled={!editable}
          type="text"
          value={name}
          ref={inputEl}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {!editable ? (
          <IconButton onClick={setGroupName}>
            <EditIcon style={{color:isNightMode ? "#fff": "#000"}} />
          </IconButton>
        ) : (
          <IconButton onClick={edited}>
            <CheckIcon style={{color:isNightMode ? "#fff": "#000"}} />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default GroupInfo;
