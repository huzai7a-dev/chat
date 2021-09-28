import React, { useState, useCallback } from "react";
import { Button, TextField } from "@material-ui/core";
import "./login.css";
import logo from "../../Assets/Bizz World Logo.png";
import { useDispatch } from "react-redux";
import { login } from "../../api/auth";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { IconButton } from "@material-ui/core";

const Login = React.memo(() => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);

  const params = {
    data: {
      email,
      password,
    },
  };
  const handleLogin = useCallback(() => {
    if (email === "") {
      setCheckEmail(true);
    } else {
      setCheckEmail(false);
    }
    if (password === "") {
      setCheckPassword(true);
    } else {
      setCheckPassword(false);
    }
  }, [email, password]);

  const loginOnEnter = useCallback(
    async (e) => {
      if (e.key === "Enter") {
        try {
          handleLogin();
          e.preventDefault();
          await dispatch(login(params));
        } catch (e) {
          console.log(e);
        }
      }
    },
    [handleLogin, email, password]
  );

  return (
    <div className="login" onKeyDown={loginOnEnter}>
      <div className="login__container">
        <img src={logo} alt="Logo" />
        <div className="login__field">
          <div className="email">
            <TextField
              style={{ width: "100%" }}
              name={email}
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={checkEmail}
            />
          </div>
          <div className="password">
            <TextField
              style={{ width: "100%" }}
              type={!visible ? "password" : "text"}
              name={password}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={checkPassword}
            />
            {password ? (
              <IconButton
                className="visibleBtn"
                onClick={() => setVisible(!visible)}
              >
                <VisibilityIcon />
              </IconButton>
            ) : null}
          </div>
        </div>
        <div className="loginBtn">
          <Button
            onClick={() => dispatch(login(params))}
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
});

export default Login;
