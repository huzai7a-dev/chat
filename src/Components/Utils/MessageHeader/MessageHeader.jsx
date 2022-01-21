import React from "react";
import { useSelector } from "react-redux";
import "./MessageHeader.css";
import { IconButton, Typography } from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useHistory, useLocation } from "react-router-dom";

const MessageHeader = () => {
  const history = useHistory();
  const location = useLocation();

  const { header, isNightMode } = useSelector((store) => {
    return {
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
          style={{ color: isNightMode ? "#fff" : "#000" }}
        >
          {header?.activeName}
        </Typography>
        <div className="left__options" onClick={openGallery}>
          <Typography variant="body2">Gallery </Typography>
          {header.activeType == "group" && header?.other.membersLength > 0 && (
            <>
              <Typography variant="body2" style={{ margin: "0 5px" }}>
                {" "}
                |{" "}
              </Typography>
              <Typography variant="body2">Members</Typography>
            </>
          )}
        </div>
      </div>
      <div className="message__header__right">
        {header.activeType == "group" && (
          <div>
            <IconButton>
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
