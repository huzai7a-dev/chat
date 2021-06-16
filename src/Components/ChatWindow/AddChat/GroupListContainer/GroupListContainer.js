import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Button,
  Input,
  Checkbox,
  Avatar,
  CircularProgress,
} from "@material-ui/core";
import "./groupListContainer.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { updateGroup } from "../../../../Redux/Action";
function GroupMemebers({ members, userId, setUserId, isChecked }) {
  const [selectMember, setSelectMember] = useState(false);
  const image = members?.elsemployees_image;
  const { user_id } = useSelector((state) => {
    return {
      user_id: state.Auth.data?.elsemployees_empid,
    };
  });
  return (
    <div
      className="groupMembers"
      onClick={() => {
        setSelectMember(!selectMember);
        if (!selectMember) {
          setUserId([...userId, members?.elsemployees_empid]);
        } else {
          setUserId(userId.slice(0, -1));
        }
      }}
    >
      <div className="groupMemberInfo">
        <div className="memberImg">
          <Avatar src={`/bizzportal/public/img/${image}`} />
        </div>
        <div className="memberName">
          <h3>{members?.elsemployees_name}</h3>
        </div>
      </div>
      <div className="groupMemberCheck">
        <Checkbox
          color="primary"
          checked={isChecked || members?.elsemployees_empid === user_id}
        />
      </div>
    </div>
  );
}

function GroupListContainer({
  setGroupModelName,
  setgroupModelListContaier,
  passGroupName,
  passGroupPicture,
}) {
  const [groupMember, setGroupMember] = useState("");
  const [memberList, setMemberList] = useState([]);
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    return state;
  });
  const [userId, setUserId] = useState([data.Auth.data?.elsemployees_empid]);
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

  const HandleGroup = () => {
    const formData = new FormData();
    formData.append("loginuser_id", data.Auth.data.elsemployees_empid);
    formData.append("user_id", data.Auth.data.elsemployees_empid);
    formData.append("group_name", passGroupName);
    formData.append("group_image", passGroupPicture);
    userId.forEach((user) => {
      formData.append(`members[]`, user);
    });
    axios
      .post("/api/bwccrm/createGroup", formData)
      .then((res) => {
        axios
          .post("/api/bwccrm/getUserGroups", {
            loginuser_id: data.Auth.data.elsemployees_empid,
            user_id: data.Auth.data.elsemployees_empid,
          })
          .then((res) => {
            dispatch(updateGroup(res.data));
          })
          .catch((err) => {
            console.warn("group error", err);
          });
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };
  const filterMember = (members) => {
    return members.elsemployees_name.toLowerCase().indexOf(groupMember) >= 0;
  };
  return (
    <div
      className="groupListContainer"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setGroupModelName(false);
          setgroupModelListContaier(false);
          HandleGroup();
        }
      }}
    >
      <div className="groupListContainer__header">
        <Button
          onClick={() => {
            setgroupModelListContaier(false);
          }}
        >
          <ArrowBackIcon />
        </Button>
        <h1>Create New Group</h1>
        <Button
          onClick={() => {
            setGroupModelName(false);
            setgroupModelListContaier(false);
            HandleGroup();
          }}
        >
          Done
        </Button>
      </div>
      <div className="groupListContainer__search">
        <Input
          placeholder="Search People"
          onChange={(e) => {
            setGroupMember(e.target.value);
          }}
          className="searchField"
        />
      </div>
      {memberList.length > 0 ? (
        <div className="groupListContainer__memberList">
          {memberList.filter(filterMember).map((members) => (
            <GroupMemebers
              members={members}
              userId={userId}
              setUserId={setUserId}
              isChecked={userId.includes(members.elsemployees_empid)}
              key={members.elsemployees_empid}
            />
          ))}
        </div>
      ) : (
        <div className="pending">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

export default GroupListContainer;
