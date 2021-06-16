import { Button } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import React from "react";
import "./signOut.css";
import { useSelector } from "react-redux";

function SignOut({ setMenuOpen }) {
  const data = useSelector((state) => {
    return state;
  });
  const signout = () => {
    localStorage.removeItem("user", data.Auth);
    window.location = "/";
  };

  return (
    <div className="signOut">
      <div className="signOut__Message">
        <p>Do you want to Sign Out ? </p>
      </div>

      <div className="signOut__Btn">
        <Button onClick={signout}>Yes</Button>
        <Button
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
