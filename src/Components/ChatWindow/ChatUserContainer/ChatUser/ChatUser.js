import { Avatar, Paper, Typography,Badge } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { quote } from "../../../../Redux/Action";
import "./chatUser.css";
import { useHistory } from "react-router-dom";


import { getSocket } from "../../../../socket";
import { getContactsUser, seenMessage } from "../../../../api/chat";
import { setActiveChat } from "../../../../Redux/actions/chat";
import { useParams } from "react-router-dom";

import loading from '../../../../Assets/loading.gif';

import { DARKLIGHT, DARKMAIN, } from "../../../../Theme/colorConstant";

  const  ChatUser = React.forwardRef((props, ref)=> {
    
  const history = useHistory();
  const dispatch = useDispatch();
  const image = props.users?.elsemployees_image;
  const { auth_user, activeUser,isTyping,isNightMode} = useSelector((store) => {
    return {
      auth_user: store.auth.auth_user || {},
      activeUser: store.chat.active_user || {},
      isTyping:store.chat?.isTyping || {},
      isNightMode:store.app.mode || false
    }
  });
  const paramData = {
    message_to: props.users.elsemployees_empid,
  };
  const getLastMessage = ()=>{
    if (props.users.last_msg.message_body) {
      return props.users.last_msg.message_body
    }
    else if (props.users.last_msg.message_attachment){
      return "Attachment"
    }
    else {
      return null
    }
  }
  const activeWindow = activeUser.elsemployees_empid == props.users.elsemployees_empid;
  const lastMessage = getLastMessage();
  const switchToConvo = () => {
   
    dispatch(setActiveChat(props.users));
    if (props.users.unseen == 1) {
      const socket = getSocket(auth_user?.elsemployees_empid);
      socket.emit("seen", paramData);
    }
    history.push(`/user/${props.users.elsemployees_empid}`);
    const seenParams =  {
      data:{
        user_id: props.users?.elsemployees_empid,
        loginuser_id: auth_user?.elsemployees_empid,
      }
    }
    
    dispatch(seenMessage(seenParams))
    .then((res) => {
      const contactParams = {
        data: {
          loginuser_id: auth_user.elsemployees_empid,
          user_id: auth_user.elsemployees_empid,
        }
      };
        const socket = getSocket(auth_user?.elsemployees_empid);
        socket.emit("seen", paramData);
        dispatch(getContactsUser(contactParams));
      })
      .catch(err => console.warn(err));
    dispatch(quote(null));
  };
  const Typing = ()=>{
    return (
      <Paper elevation={0} style={{display:"flex"}}> 
        <Typography variant="caption" color="textSecondary">Typing</Typography>
        <img src={loading} alt="Loading" height="20px" width="20px" className="loading" />
      </Paper>
    )
  }
  const background = isNightMode ? DARKMAIN : "#fff";
  const activeBackground = isNightMode ? DARKLIGHT : "#d8ecf7";
  const heading = isNightMode ? "#fff" : "#252423";
  return (
    <div className="chatUser" ref={ref} onClick={switchToConvo} style={{background: activeWindow ? activeBackground : background}}>
      <div className="loginStatus" />
      <div className="chatUser__picture">
        {image ? (
          <Avatar src={`/bizzportal/public/img/${image}`} />
        ) : (
          <Avatar>{props.users?.elsemployees_name[0]}</Avatar>
        )}
      </div>
      <div className="chatUser__details" >
        <h3 style={{ color: props.users.unseen ? "#267396" : heading}}>
          {props.users?.elsemployees_name}
        </h3>
        <div className="chatUser__lastMessage">
          {
           isTyping?.data?.tPerson == props.users?.elsemployees_empid && isTyping.status ? <Typing/> : <p>{lastMessage}</p>
          }
        </div>
      </div>
      <div className="unseenMsg">
        <Badge badgeContent={props.users.unseen} color="primary"></Badge>
      </div>
    </div>  
  );
})

export default ChatUser;
