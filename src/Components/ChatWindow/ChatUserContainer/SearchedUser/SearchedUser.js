import { Avatar } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { searchData, Userid } from "../../../../Redux/Action";

function SearchedUser({ users }) {
  const img = users?.elsemployees_image;
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <div
      className="chatUser"
      onClick={() => {
        history.push("/user");
        dispatch(Userid(users));
        dispatch(searchData(""));
      }}
    >
      <div className="chatUser__picture">
        <Avatar
          src={`/bizzportal/public/img/${img}`}
        />
      </div>
      <div className="chatUser__details">
        <h3>{users?.elsemployees_name}</h3>
      </div>
    </div>
  );
}

export default SearchedUser;
