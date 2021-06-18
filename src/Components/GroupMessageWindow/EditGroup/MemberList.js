import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Input,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupMemberInfo, modelState, nameToMember, updateGroup } from "../../../Redux/Action";
import { getSocket } from "../../../socket";
function MemberList() {
  const data = useSelector((state) => {
    return state;
  });
  const [membersId, setMembersId] = useState(data.groupChat?.memberid?.split(","))
  const [memberList, setMemberList] = useState([]);
  const [groupMember, setGroupMember] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .post("/api/bwccrm/getContactsTotal", {
        campaign_id: 1,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        setMemberList(res.data.contacts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  const closeGroup = () => {
    axios
      .post("/api/bwccrm/getUserGroups", {
        loginuser_id: data.Auth.data?.elsemployees_empid,
        user_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        history.push("/");
        dispatch(updateGroup(res.data));
        dispatch(nameToMember(false))
        dispatch(modelState(false))
      })
      .catch((err) => {
        console.warn("group error", err);
      });
  };

  const filterMember = (members) => {
    return members?.elsemployees_name?.toLowerCase()?.indexOf(groupMember) >= 0;
  };
  const sortByAdded = (a) => {
    if (membersId.includes(a.elsemployees_empid.toString())) {
      return -1;
    } else {
      return 1;
    }
  };
  
  return (
    <div style={{ height: "80%" }}>
      <div className="editGroupTop">
        <IconButton onClick={() => dispatch(nameToMember(false))}>
          <ArrowBackIcon />
        </IconButton>
        <Button onClick={closeGroup}>Done</Button>
      </div>
      <div className="searchMember">
        <Input
          value={groupMember}
          placeholder="Search people"
          style={{ width: "80%", marginTop: "20px" }}
          onChange={(e) => {
            setGroupMember(e.target.value);
          }}
        />
      </div>
      {memberList.length > 0 ? (
        <div className="membersList">
          {memberList
            .filter(filterMember)
            .sort(sortByAdded)
            .map((member) => {
              const image = member?.elsemployees_image;
              const allMembers = member?.elsemployees_empid.toString();
              const isMemberAdded = membersId.includes(allMembers);

              const addMember = () => {
                const addParamData = {
                  user_id: data.Auth.data?.elsemployees_empid,
                  group_id: data.groupChat?.group_id,
                  member_id: member?.elsemployees_empid,
                  member_name: member?.elsemployees_name,
                  event:"added"
                }
                const formData = new FormData();
                formData.append('user_id', data.Auth.data?.elsemployees_empid)
                formData.append('group_id', data.groupChat?.group_id);
                formData.append('member_id', member?.elsemployees_empid)
                axios.post('/api/bwccrm/addmember', formData)
                  .then(res => {
                    setMembersId(res.data.updatedmembers.split(","))
                    const socket = getSocket();
                    socket.emit("group-member", addParamData);
                  })
                  .catch(err => console.log(err))
              }

              const removeMember = () => {
                const removeParamData = {
                  user_id: data.Auth.data?.elsemployees_empid,
                  group_id: data.groupChat?.group_id,
                  member_id: member?.elsemployees_empid,
                  member_name: member?.elsemployees_name,
                  event:"removed"
                }
                
                const formData = new FormData();
                formData.append('user_id', data.Auth.data?.elsemployees_empid)
                formData.append('group_id', data.groupChat?.group_id);
                formData.append('member_id', member?.elsemployees_empid)
                axios.post('/api/bwccrm/removemember', formData)
                  .then(res => {
                    setMembersId(res.data.updatedmembers.split(","))
                    const socket = getSocket();
                    socket.emit("group-member", removeParamData);
                  })
                  .catch(err => console.log(err))
              }
              return (
                <div className="member" key={member?.elsemployees_empid}>
                  <div className="memberImg">
                    <Avatar src={`/bizzportal/public/img/${image}`} />
                  </div>
                  <div className="memberName">
                    <h3>{member?.elsemployees_name}</h3>
                  </div>
                  {isMemberAdded ? (
                    <IconButton onClick={removeMember}>
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={addMember}>
                      <AddIcon />
                    </IconButton>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div className="pending">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default MemberList;
