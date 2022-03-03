import React, { useCallback, useEffect, useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  Button,
  Input,
  Checkbox,
  Avatar,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import "./groupListContainer.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { BLACK, DARKMAIN, LIGHT, PRIMARYMAIN, WHITE } from "../../../../Theme/colorConstant";
import { createGroup } from "../../../../api/chat";
import { setUserGroups } from "../../../../Redux/actions/chat";
import Utils from "../../../../helper/util";
import { getContactsTotal } from "../../../../api/message";
const GroupMemebers = React.memo(
  ({ members, userId, setUserId, isChecked }) => {
    const [selectMember, setSelectMember] = useState(false);
    const image = members?.elsemployees_image;
    const { user_id, isNightMode } = useSelector((state) => {
      return {
        user_id: state.auth.auth_user?.elsemployees_empid,
        isNightMode: state.app.mode || false,
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
            <Typography
              variant="h6"
              style={{ color: isNightMode ? WHITE : "#000" }}
            >
              {members?.elsemployees_name}
            </Typography>
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
);

const GroupListContainer = ({
  setGroupModelName,
  setgroupModelListContaier,
  passGroupName,
  passGroupPicture,
}) => {
  const [groupMember, setGroupMember] = useState("");
  const [memberList, setMemberList] = useState([]);
  const dispatch = useDispatch();

  const { auth_user, isNightMode } = useSelector((store) => {
    return {
      auth_user: store?.auth.auth_user || {},
      isNightMode: store.app.mode || false,
    };
  });

  const [userId, setUserId] = useState([auth_user?.elsemployees_empid]);

  const getContacts = useCallback(async () => {
    const response = await dispatch(
      getContactsTotal({
        data: { campaign_id: 1, user_id: auth_user?.elsemployees_empid },
      })
    );
    setMemberList(response.data.contacts);
  }, [auth_user?.elsemployees_empid, dispatch]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const onCreateGroup = () => {
    const params = {
      data: {
        loginuser_id: auth_user?.elsemployees_empid,
        user_id: auth_user?.elsemployees_empid,
        group_name: passGroupName,
        group_image: passGroupPicture,
        members: userId.map((user) => user),
      },
    };
    params.data = Utils.getFormData(params.data);
    const response = dispatch(createGroup(params));
  };
  const filterMember = (members) => {
    return members.elsemployees_name.toLowerCase().indexOf(groupMember) >= 0;
  };
  return (
    <div
      style={{ background: isNightMode ? DARKMAIN : LIGHT }}
      className="groupListContainer"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setGroupModelName(false);
          setgroupModelListContaier(false);
          onCreateGroup();
        }
      }}
    >
      <div className="groupListContainer__header">
        <Button
          onClick={() => {
            setgroupModelListContaier(false);
          }}
        >
          <ArrowBackIcon style={{ color: isNightMode && PRIMARYMAIN }} />
        </Button>
        <Typography variant="h6" style={{ color: WHITE }}>
          Create New Group
        </Typography>
        <Button
          onClick={() => {
            setGroupModelName(false);
            setgroupModelListContaier(false);
            onCreateGroup();
          }}
          style={{ color: isNightMode && PRIMARYMAIN }}
        >
          Done
        </Button>
      </div>
      <div className="groupListContainer__search">
        <Input
          style={{ color: isNightMode ? WHITE : BLACK }}
          placeholder="Search People"
          onChange={(e) => {
            setGroupMember(e.target.value);
          }}
          className="searchField"
        />
      </div>
      {memberList.length > 0 ? (
        <div
          className="groupListContainer__memberList"
          style={{ background: isNightMode ? DARKMAIN : LIGHT }}
        >
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
};

export default React.memo(GroupListContainer);
