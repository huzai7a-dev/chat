import { useSelector } from "react-redux";
import { DARKMAIN } from "../../../Theme/colorConstant";
import "./EditGroup.css";
import GroupInfo from "./GroupInfo";
import MemberList from "./MemberList";
function EditGroup() {
    const { editGroupNameToMemberModelState,isNightMode } = useSelector((store) => {
        return {
            editGroupNameToMemberModelState:store.app.editGroupNameToMemberModelState || false,
            isNightMode:store.app.mode || false
        }
      });
    return (
        <div className="editGroup" style={{background: isNightMode ? DARKMAIN : "#eee"}}>
            {!editGroupNameToMemberModelState ? <GroupInfo /> : <MemberList />}
        </div>
    );
}

export default EditGroup;
