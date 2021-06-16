import { Avatar } from "@material-ui/core";
import React from "react";
import "./Welcome.css";
import { useSelector } from "react-redux";

function Welcome() {
  const data = useSelector((state) => {
    return state;
  });
  const image = data.Auth.data?.elsemployees_image;
  return (
    <div className="welcome">
      <div className="welcome__container">
        <div className="userName">
          <h1>
            Welcome <span>{data.Auth.data?.elsemployees_name}</span>
          </h1>
        </div>
        <div className="User__picture">
          <Avatar
            src={`/bizzportal/public/img/${image}`}
          />
        </div>
      </div>
    </div>
  );
}

export default Welcome;
