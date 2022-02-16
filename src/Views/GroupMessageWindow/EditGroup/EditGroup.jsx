import React from 'react';
import { useSelector } from "react-redux";
import { DARKMAIN } from "../../../Theme/colorConstant";
import GroupInfo from "./GroupInfo";
import MemberList from "./MemberList";
import "./EditGroup.css";

function EditGroup() {
    const { switchToMember,isNightMode } = useSelector((store) => {
        return {
            switchToMember:store.app.editGroupNameToMemberModelState || false,
            isNightMode:store.app.mode || false
        }
      });
    return (
        <div className="editGroup" style={{background: isNightMode ? DARKMAIN : "#eee"}}>
            {!switchToMember ? <GroupInfo /> : <MemberList />}
        </div>
    );
}

export default EditGroup;
