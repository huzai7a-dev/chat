import { Avatar, IconButton, Typography } from "@material-ui/core";
import React from "react";
import "./Welcome.css";
import { useSelector } from "react-redux";

import MenuOpenIcon from '@material-ui/icons/MenuOpen';
function Welcome() {
  const avatarStyle = {
    width:"120px",
    height:"120px"
  }
  const { auth_user,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      isNightMode:store.app.mode || false
    }
  });
  const image = auth_user?.elsemployees_image;
  return (
    <div className="welcome" style={{color: isNightMode ? "#267396": "#000"}}>
      
      <div className="welcome__container">
        <div className="userName">
          <Typography variant="h6">
            Welcome {auth_user?.elsemployees_name}
          </Typography>
        </div>
        <div className="User__picture">
          {image ? (<Avatar style={avatarStyle}
            src={`/bizzportal/public/img/${image}`}
          />): (<Avatar style={avatarStyle}>{auth_user?.elsemployees_name.toUpperCase()[0]}</Avatar>)}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
