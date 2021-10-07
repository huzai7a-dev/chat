import { Avatar, makeStyles,Badge,Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import "./chatUser.css";
import { useHistory } from "react-router-dom";
import { setActiveGroup, } from "../../../../Redux/actions/chat";
import { getUserGroups, seenGroupMessage} from "../../../../api/chat";
import { DARKLIGHT, DARKMAIN, PRIMARYMAIN, SECONDARYDARK, WHITE } from "../../../../Theme/colorConstant";
import moment from 'moment'
import { getSocket } from "../../../../socket";
const useStyles = makeStyles({
  group:{
    background:SECONDARYDARK,
    color:PRIMARYMAIN,
    fontWeight:"600",
    fontSize:".8rem",
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
      const socketParams = {
          group_id:active_group.group_id,
          user_id:auth_user?.elsemployees_empid,
          info:"real time seen"
      }
      const socket = getSocket(auth_user?.elsemployees_empid);
      socket.emit("group-seen", socketParams);
      const params = {
        data: {
          loginuser_id: auth_user?.elsemployees_empid,
          user_id: auth_user?.elsemployees_empid,
        },
      };
      dispatch(getUserGroups(params));
    })
    
  }
  const background = isNightMode && DARKMAIN ;
  const activeBackground = isNightMode ? DARKLIGHT : WHITE;
  const heading = isNightMode ? "#fff" : "#252423";
  
  const groupNamePicture = groups.group_name.split(" ").length > 1 ? groups.group_name.toUpperCase().split(" ")[0][0] + groups.group_name.toUpperCase().split(" ")[1][0] : groups.group_name.toUpperCase()[0] + groups.group_name.toUpperCase()[1]
  
  return (
    <div
      className="chatUser"
      style={{background: active ? activeBackground : background}}
      onClick={switchToGroupChat}
    >
      <div className="chatUser__picture">
        {image ? (<Avatar src={`/api/bwccrm/storage/app/public/chat_attachments/${image}`} />) : (<Avatar className={classes.group}>{groupNamePicture}</Avatar>)}
      </div>
      <div className="chatUser__details">
        <Box display="flex" justifyContent="space-between">
          <h3 style={{color:groups.groupunseenmesg > 0 ? "#267396" :heading, fontWeight: groups.groupunseenmesg  ? "600":"100", flex:"3"}}>{groups.group_name}</h3>
          <p style={{flex:"1"}}>{moment(groups?.groupmessagetime).format("LT")}</p>
        </Box>

        <div className="chatUser__lastMessage">
          <p style={{fontWeight: groups.groupunseenmesg > 0 && "900"}}>{groups.lastmessage ? (groups.lastmessage) : "Attachment"}</p>
        </div>
      </div>
      <div className="unseenMsg">
        <Badge badgeContent={groups.groupunseenmesg} color="primary"></Badge>
      </div>
    </div>
  );
}

export default React.memo(ChatGroup);
