import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import { Avatar, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { modelState, nameToMember } from "../../../Redux/Action";
import axios from "axios";
function GroupInfo() {
    const data = useSelector((state) => {
        return state;
    });
    const dispatch = useDispatch();
    const image = data.groupChat?.group_image;
    const [name, setName] = useState(data.groupChat?.group_name);
    const [editable, setEditable] = useState(false);
    const [groupPicture, setGroupPicture] = useState(`/api/bwccrm/storage/app/public/chat_attachments/${image}`);
    const [selectedImage, setSelectedImage] = useState();
    const inputEl = useRef();
    const setGroupName = () => {
        inputEl.current.focus();
        setEditable(true);
    };
    const edited = () => {
        setEditable(false);
        inputEl.current.blur();
    }
    const nameChanged = data.groupChat?.group_name !== name;
    const imgChanged = `/api/bwccrm/storage/app/public/chat_attachments/${image}` !== groupPicture;
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

    const groupNamePicture = () => {
        dispatch(nameToMember(true))
        if (nameChanged || imgChanged) {
            const formData = new FormData();
            formData.append("user_id", data.Auth.data?.elsemployees_empid);
            formData.append("loginuser_id", data.Auth.data?.elsemployees_empid);
            formData.append("group_id", data.groupChat?.group_id);
            formData.append("group_name", name);
            formData.append("group_image", selectedImage);
            axios
                .post("/api/bwccrm/updateGroup", formData)
                .then((res) => {
                    setName(res.data.groupupdated.group_name)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    return (
        <div className="groupInfo">
            <div className="groupInfoHeader">
                <IconButton onClick={() => dispatch(modelState(false))}>
                    <CloseIcon />
                </IconButton>

                <IconButton onClick={groupNamePicture}>
                    <NavigateNextIcon />
                </IconButton>
            </div>
            <div className="groupInfoPicture">
                <label>
                    <input type="file" onChange={handleImageChange} />
                    <Avatar src={groupPicture} style={{ width: "80px", height: "80px" }} />
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
                        <EditIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={edited}>
                        <CheckIcon />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

export default GroupInfo;
