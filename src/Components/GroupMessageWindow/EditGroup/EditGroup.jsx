import { useSelector } from "react-redux";
import "./EditGroup.css";
import GroupInfo from "./GroupInfo";
import MemberList from "./MemberList";
function EditGroup() {
    const data = useSelector((state) => {
        return state;
    });
    return (
        <div className="editGroup">
            {!data.nameToMember ? <GroupInfo /> : <MemberList />}
        </div>
    );
}

export default EditGroup;
