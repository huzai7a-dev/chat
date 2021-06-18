import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import "./chatUser.css";
import { groupChat, quote, updateGroup, Userid } from "../../../../Redux/Action";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
function ChatGroup({ groups }) {
  const [seen, setSeen] = useState(false);
  const history = useHistory();
  const image = groups.group_image;
  const dispatch = useDispatch();
  const data = useSelector((state) => {
    return state;
  });


  // const LetterPicture = () => {
  //   const fLetter = groups.group_name.split(" ")[0].charAt(0);
  //   const sLetter = groups.group_name.split(" ")[1].charAt(0);
  //   return (
  //     <div className="pictureContainer">
  //       <h2 className="picture">{fLetter + sLetter}</h2>
  //     </div>
  //   )
  // }
  return (
    <div
      className="chatUser"
      onClick={() => {
        dispatch(groupChat(groups));
        axios
          .post("/api/bwccrm/makeSeen", {
            user_id: groups.group_id,
            loginuser_id: data.Auth.data.user_id,
          })
          .then((res) => {
            axios
              .post("/api/bwccrm/getUserGroups", {
                loginuser_id: data.Auth.data.elsemployees_empid,
                user_id: data.Auth.data.elsemployees_empid,
              })
              .then((res) => {
                dispatch(updateGroup(res.data));
              })
              .catch((err) => {
                console.warn("group error", err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
        history.push("/group");
        setSeen(true);
        dispatch(quote(null))
      }}
    >
      <div className="chatUser__picture">
        {/* {image ? (<Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />) : <LetterPicture />} */}
        <Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />
      </div>
      <div className="chatUser__details">
        <h3>{groups.group_name}</h3>
        <p>{groups.lastmessage ? (groups.lastmessage) : "Attachment"}</p>
      </div>
    </div>
  );
}

export default ChatGroup;
