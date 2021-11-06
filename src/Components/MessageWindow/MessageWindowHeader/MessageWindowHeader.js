import React from "react";
import "./messageWindowHeader.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  Tooltip,
  Typography,
  Modal,
  Backdrop,
} from "@material-ui/core";

import CallIcon from "@material-ui/icons/Call";
import { getUserAttachments } from "../../../api/message";
import { setGallery } from "../../../Redux/actions/message";
import OnCall from "../../Call/OnCall";
function MessageWindowHeader() {
  const { active_user, isNightMode, auth_user } = useSelector((store) => {
    return {
      active_user: store.chat.active_user || {},
      isNightMode: store.app.mode || false,
      auth_user: store.auth.auth_user || {},
    };
  });
  const [openCall, setOpenCall] = React.useState(false);
  const dispatch = useDispatch();
  const openGallery = () => {
    // setGallery(true)
    dispatch(setGallery(true));
    const params = {
      data: {
        user_id: auth_user?.elsemployees_empid,
        from_id: auth_user?.elsemployees_empid,
        to_id: active_user?.elsemployees_empid,
      },
    };
    dispatch(getUserAttachments(params));
  };
  return (
    <div className="MessageWindowHeader">
      <div className="userName">
        <h2 style={{ color: isNightMode ? "#fff" : "#000" }}>
          {active_user?.elsemployees_name}
        </h2>
        <div onClick={openGallery}>
          <Typography variant="body2">Gallery</Typography>
        </div>
      </div>
      <div>
        <Tooltip title="Make a call">
          <IconButton onClick={() => setOpenCall(true)}>
            <CallIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div>
      <Modal
        open={openCall}
        onClose={() => setOpenCall(false)}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <OnCall callTo={active_user?.elsemployees_name} />
      </Modal>
    </div>
  );
}

export default MessageWindowHeader;
