import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { useDispatch, useSelector } from "react-redux";
import "./MessageHeader.css";
import {
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Backdrop,
} from "@material-ui/core";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
// import { getUserAttachments } from "../../../api/message";
// import { setGallery } from "../../../Redux/actions/message";

const MessageHeader = () => {
  const { header, isNightMode, auth_user } = useSelector((store) => {
    return {
      header: store.chat.active || {},
      isNightMode: store.app.mode || false,
      auth_user: store.auth.auth_user || {},
    };
  });

  const dispatch = useDispatch();
  //   const openGallery = () => {
  //     dispatch(setGallery(true));
  //     const params = {
  //       data: {
  //         user_id: auth_user?.elsemployees_empid,
  //         from_id: auth_user?.elsemployees_empid,
  //         to_id: active_user?.elsemployees_empid,
  //       },
  //     };
  //     dispatch(getUserAttachments(params));
  //   };

  return (
    <div className="message__header">
      <div className="message__header__left">
        <Typography
          variant="h5"
          style={{ color: isNightMode ? "#fff" : "#000" }}
        >
          {header?.activeName}
        </Typography>
        <div className="left__options">
          <Typography variant="body2">Gallery </Typography>
          {header.activeType == "group" && header?.other.membersLength > 0 && (
            <>
            <Typography variant="body2" style={{margin:"0 5px"}}> | </Typography>
            <Typography variant="body2">Members</Typography>
            </>
          )}
        </div>
      </div>
      <div className="message__header__right">
        {
          header.activeType == "group" && (
            <div>
              <IconButton>
                <GroupAddIcon color="primary" style={{ width: "40px", height: "40px" }} />
              </IconButton>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default MessageHeader;
