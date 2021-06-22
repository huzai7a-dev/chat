import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import "./login.css";
import logo from "../../Assets/Bizz World Logo.png";
import { useDispatch } from "react-redux";
import { LoginNow } from "../../Redux/Action";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";

function Login() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [open, setOpen] = useState(true);

  const handleLogin = () => {
    if (Email === "") {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
    if (Password === "") {
      setCheckPassword(true);
    } else {
      setCheckPassword(false);
    }
  };
  const loginOnEnter = (e) => {
    if (e.key === "Enter") {
      handleLogin();
      e.preventDefault();
      dispatch(LoginNow({ Email, Password }));
    }
  };
  return (
    
    <div className="login" onKeyDown={loginOnEnter}>
      <div className="login__container">
        <img src={logo} alt="Logo" />
        <div className="login__field">
          <div className="email">
            <TextField
              style={{ width: "100%" }}
              name={Email}
              label="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              error={checkEmail}
            />
          </div>
          <div className="passowrd">
            <TextField
              style={{ width: "100%" }}
              type={!visible ? "password" : "text"}
              name={Password}
              label="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              error={checkPassword}
            />
            {Password ? (
              <IconButton
                className="visibleBtn"
                onClick={() => {
                  setVisible(!visible);
                }}
              >
                <VisibilityIcon />
              </IconButton>
            ) : (
              null
            )}
          </div>
        </div>

        <div className="loginBtn">
          <Button
            onClick={() => dispatch(LoginNow({ Email, Password }))}
            type="submit"
            style={{
              background: "#feb318",
              color: "#fff",
              width: "100%",
              textDecoration: "none",
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
