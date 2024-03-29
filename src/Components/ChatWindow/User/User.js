import React, {useState,useCallback } from "react";
import { Avatar,IconButton, Tooltip, Typography  } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Modal from "react-modal";
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import "./user.css";
import {setNightMode,setAdminPanel, setSideBar} from '../../../Redux/actions/app'; 
import { useDispatch, useSelector } from "react-redux";
import SignOut from "./SignOut/SignOut";
import { useHistory } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {ADMIN} from '../../../Role/index';
import { PRIMARYMAIN, WHITE } from "../../../Theme/colorConstant";
Modal.setAppElement("#root");
  
const User = () => {
  const dispatch = useDispatch();
  const { auth_user,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode:store.app.mode || false
    }
  });
  const role = auth_user.elsemployees_roleid;
  const history = useHistory()
  const [isMenuOpen, setMenuOpen] = useState(false);
  const image = auth_user?.elsemployees_image;

  const switchToAdmin = useCallback(()=>{
    dispatch(setAdminPanel(true))
    history.push('/admin')
  },[dispatch, history])
  
  return (
    <div className="user">
      <div className="user__info">
        <Avatar
          src={`/bizzportal/public/img/${image}`}
          className="userImg"
        />
        <Typography variant="caption" style={{color:isNightMode ? WHITE: PRIMARYMAIN}} className="userName">{auth_user?.elsemployees_name}</Typography>
        <div className="onlineStatus"></div>
      </div>
      { role == ADMIN ? (
        <Tooltip title={"Admin Panel"}>
        <IconButton onClick={switchToAdmin}>
          <AdminPanelSettingsIcon style={{color:isNightMode ? WHITE: PRIMARYMAIN}}/>
        </IconButton>
      </Tooltip>
      ): null
      }
      <Tooltip title={isNightMode ? "Day Mode": "Night Mode"}>
        <IconButton color='primary' onClick={()=>{dispatch(setNightMode(!isNightMode))}}>
          {!isNightMode ?
            <Brightness3Icon color='primary' style={{color:isNightMode ? WHITE : PRIMARYMAIN}}/> : <WbSunnyIcon color='primary' style={{color:isNightMode ? WHITE : PRIMARYMAIN}}/>
          }
        </IconButton>
      </Tooltip>
      <div>
        <Tooltip title="Logout">
        <IconButton
          
          onClick={() => {
            setMenuOpen(true);
            if(window.innerWidth < 700 ){
              dispatch(setSideBar(true));
            }
          }}
        >
          <ExitToAppIcon style={{color:isNightMode ? WHITE : PRIMARYMAIN}}/>
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
};

export default User;
