import React, {useState } from "react";
import { Avatar,IconButton  } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Modal from "react-modal";
import "./user.css";

import { useSelector } from "react-redux";
import SignOut from "./SignOut/SignOut";

Modal.setAppElement("#root");

function User() {
  const data = useSelector((state) => {
    return state;
  });

  const [isMenuOpen, setMenuOpen] = useState(false);
  const image = data.Auth.data?.elsemployees_image;
  return (
    <div className="user">
      <div className="user__info">
        <Avatar
          src={`/bizzportal/public/img/${image}`}
          className="userImg"
        />
        <p className="userName">{data.Auth.data?.elsemployees_name}</p>
        <div className="onlineStatus"></div>
      </div>

      <div>
        <IconButton
          className="signOut"
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <ExitToAppIcon/>
        </IconButton>

        <Modal
          className="signOutModel"
          isOpen={isMenuOpen}
          onRequestClose={() => {
            setMenuOpen(false);
          }}
        >
          <SignOut isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
        </Modal>
      </div>
    </div>
  );
}

export default User;
