import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./MessageHeader.css";
import { IconButton, Typography } from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import ConnectWithoutContactIcon from '@material-ui/icons/Phone';
import PhoneIcon from "@material-ui/icons/Phone";
import { useHistory, useLocation } from "react-router-dom";
import {
  setEditGroupModelState,
  setParticipantModelState,
} from "../../../Redux/actions/app";
import { setCallingToUser } from "../../../Redux/actions/call";
import { BLACK, WHITE } from "../../../Theme/colorConstant";

const MessageHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { header, isNightMode, active_user } = useSelector((store) => {
    return {
      active_user: store.chat.active_user,
      header: store.chat.active || {},
      isNightMode: store.app.mode || false,
    };
  });

  const openGallery = (e) => {
    e.preventDefault();
    history.replace(`${location.pathname}#gallery`);
  };

  return (
    <div className="message__header">
      <div className="message__header__left">
        <Typography
          variant="h5"
          style={{ color: isNightMode ? WHITE : BLACK }}
        >
          {header?.activeName}
        </Typography>
        <div className="left__options">
          <Typography variant="body2" onClick={openGallery}>
            Gallery{" "}
          </Typography>
          {header.activeType == "group" && header?.other.membersLength > 0 && (
            <>
              <Typography variant="body2" style={{ margin: "0 5px" }}>
                {" "}
                |{" "}
              </Typography>
              <Typography
                onClick={() => dispatch(setParticipantModelState(true))}
                variant="body2"
              >
                Members
              </Typography>
            </>
          )}
        </div>
      </div>
      <div className="message__header__right">
        <IconButton
          onClick={() => dispatch(setCallingToUser(active_user))}
        >
          <PhoneIcon
            color="primary"
            style={{ width: "30px", height: "30px" }}
          />
        </IconButton>

        {header.activeType == "group" && (
          <div>
            <IconButton onClick={() => dispatch(setEditGroupModelState(true))}>
              <GroupAddIcon
                color="primary"
                style={{ width: "40px", height: "40px" }}
              />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHeader;
