import { Avatar } from "@material-ui/core";
import { useDispatch,useSelector } from "react-redux";
import { useHistory } from "react-router";
import { setSearchText } from "../../../../Redux/actions/app";
import { setActiveChat } from "../../../../Redux/actions/chat";
import { DARKLIGHT, DARKMAIN } from "../../../../Theme/colorConstant";

function SearchedUser({ users }) {
  const img = users?.elsemployees_image;
  const dispatch = useDispatch();
  const history = useHistory();
  const {activeUser,isNightMode} = useSelector(state =>{
    return {
      activeUser: state.chat?.active_user,
      isNightMode:state.app?.mode || false
    }
  })
  const background = isNightMode ? DARKLIGHT : "#fff";
  const heading = isNightMode ? "#fff" : "#252423";
  return (
    <div
      className="chatUser"
      style={{background:background}}
      onClick={() => {
        history.push(`/user/${users.elsemployees_empid}`);
        dispatch(setActiveChat(users));
        dispatch(setSearchText(""));
      }}
    >
      <div className="chatUser__picture">
        <Avatar
          src={`/bizzportal/public/img/${img}`}
        />
      </div>
      <div className="chatUser__details">
        <h3 style={{color: heading}}>{users?.elsemployees_name}</h3>
      </div>
    </div>
  );
}

export default SearchedUser;
