import { Avatar } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { quote, upDateUser, Userid } from "../../../../Redux/Action";
import "./chatUser.css";
import { useHistory } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import axios from "axios";
import { getSocket } from "../../../../socket";

function ChatUser(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const image = props.users?.elsemployees_image;
  const data = useSelector((state) => {
    return state;
  });
  const LetterPicture = () => {
    const fLetter = props.users?.elsemployees_name?.split(" ")[0].charAt(0);
    const sLetter = props.users?.elsemployees_name?.split(" ")[1].charAt(0);
    return (
      <div className="pictureContainer">
        <h2 className="picture">{fLetter + sLetter}</h2>
      </div>
    );
  };
  const paramData = {
    message_to: props.users.elsemployees_empid,
  };
  const switchToConve = () => {
    dispatch(Userid(props.users));
    if (props.users.unseen == 1) {
      const socket = getSocket(data.Auth.data?.elsemployees_empid);
      socket.emit("seen", paramData);
    }
    axios
      .post("/api/bwccrm/makeSeen", {
        user_id: props.users?.elsemployees_empid,
        loginuser_id: data.Auth.data?.elsemployees_empid,
      })
      .then((res) => {
        const socket = getSocket(data.Auth.data?.elsemployees_empid);
        socket.emit("seen", paramData);
        axios
          .post("/api/bwccrm/getContactsUser", {
            loginuser_id: data.Auth.data?.elsemployees_empid,
            user_id: data.Auth.data?.elsemployees_empid,
          })
          .then((res) => {
            dispatch(upDateUser(res.data.contacts));
          });
      })
      .catch((err) => {
        console.log(err);
      });
    history.push("/user");
    dispatch(quote(null));
  };
  return (
    <div className="chatUser" onClick={switchToConve}>
      <div className="loginStatus" />
      <div className="chatUser__picture">
        {image ? (
          <Avatar src={`/bizzportal/public/img/${image}`} />
        ) : (
          <LetterPicture />
        )}
      </div>
      <div className="chatUser__details">
        <h3 style={{ fontWeight: props.users.unseen ? "700" : "400" }}>
          {props.users?.elsemployees_name}
        </h3>
        <p>
          {props.users.last_msg.message_body
            ? props.users.last_msg.message_body
            : "Attachment"}
        </p>
      </div>
      <div className="unseenMsg">
        <Badge badgeContent={props.users.unseen} color="primary"></Badge>
      </div>
    </div>
  );
}

export default ChatUser;
