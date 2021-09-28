import React, {useState } from "react";
import { Avatar,IconButton, Tooltip  } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Modal from "react-modal";
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import "./user.css";
import {setNightMode} from '../../../Redux/actions/app'; 
import { useDispatch, useSelector } from "react-redux";
import SignOut from "./SignOut/SignOut";

Modal.setAppElement("#root");

const User = React.memo(() => {
  const dispatch = useDispatch();
  const { auth_user,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode:store.app.mode || false
    }
  });

  const [isMenuOpen, setMenuOpen] = useState(false);
  const image = auth_user?.elsemployees_image;
  return (
    <div className="user">
      <div className="user__info">
        <Avatar
          src={`/bizzportal/public/img/${image}`}
          className="userImg"
        />
        <p className="userName">{auth_user?.elsemployees_name}</p>
        <div className="onlineStatus"></div>
      </div>
      <Tooltip title={isNightMode ? "Day Mode": "Night Mode"}>
        <IconButton onClick={()=>{dispatch(setNightMode(!isNightMode))}}>
          {!isNightMode ?
            <Brightness3Icon color="primary"/> : <WbSunnyIcon color="primary"/>
          }
        </IconButton>
      </Tooltip>
      <div>
        <Tooltip title="Logout">
        <IconButton
          
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <ExitToAppIcon color="primary"/>
        </IconButton>
        </Tooltip>
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
});

export default User;
