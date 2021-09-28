import { Button } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from "react";
import "./signOut.css";
import { useSelector } from "react-redux";
import { DARKMAIN } from "../../../../Theme/colorConstant";

function SignOut({ setMenuOpen }) {
  const {isNightMode } = useSelector((store) => {
    return {
      isNightMode:store.app.mode || false
    }
  });
  const signOut = () => {
    localStorage.removeItem("user");
    window.location = "/";
  };

  return (
    <div className="signOut"  style={{background: isNightMode ? DARKMAIN: "#eee"}}>
      <div className="signOut__Message">
        <p>Do you want to Sign Out ? </p>
      </div>

      <div className="signOut__Btn">
        <Button onClick={signOut} color="primary">Yes</Button>
        <Button
          color="primary"
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          No
        </Button>
      </div>
    </div>
  );
}

export default SignOut;
