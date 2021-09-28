import { Avatar, makeStyles,Badge } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import "./chatUser.css";
import { useHistory } from "react-router-dom";
import { setActiveGroup, } from "../../../../Redux/actions/chat";
import { getUserGroups, seenGroupMessage} from "../../../../api/chat";
import { DARKLIGHT, DARKMAIN } from "../../../../Theme/colorConstant";

const useStyles = makeStyles({
  group:{
    background:"#267396",
  }
})
function ChatGroup({ groups }) {
  const classes = useStyles();
  const history = useHistory();
  const image = groups.group_image;
  const dispatch = useDispatch();
  const { auth_user,active_group,isNightMode } = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      active_group: store.chat.active_group || {},
      isNightMode:store.app.mode || false
    }
  });
  const active = active_group.group_id == groups.group_id;
  const switchToGroupChat = () => {
    dispatch(setActiveGroup(groups))
    history.push(`/group/${groups.group_name}`)
    const seenParams = {
      data:{
        group_id:groups.group_id,
        user_id:auth_user?.elsemployees_empid
      }
    }
    dispatch(seenGroupMessage(seenParams))
    .then((res)=>{
      const params = {
        data: {
          loginuser_id: auth_user?.elsemployees_empid,
          user_id: auth_user?.elsemployees_empid,
        },
      };
      dispatch(getUserGroups(params));
    })
    
  }
  const background = isNightMode ? DARKMAIN : "#fff";
  const activeBackground = isNightMode ?  DARKLIGHT : "#d8ecf7";
  const heading = isNightMode ? "#fff" : "#252423";
  return (
    <div
      className="chatUser"
      style={{background: active ? activeBackground : background}}
      onClick={switchToGroupChat}
    >
      <div className="chatUser__picture">
        {image ? (<Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />) : (<Avatar className={classes.group}>{groups.group_name.toUpperCase()[0]}</Avatar>)}
      </div>
      <div className="chatUser__details">
        <h3 style={{color:groups.groupunseenmesg > 0 ? "#267396" :heading }}>{groups.group_name}</h3>
        <p style={{fontWeight: groups.groupunseenmesg > 0 && "900"}}>{groups.lastmessage ? (groups.lastmessage) : "Attachment"}</p>
      </div>
      <div className="unseenMsg">
        <Badge badgeContent={groups.groupunseenmesg} color="primary"></Badge>
      </div>
    </div>
  );
}

export default ChatGroup;
